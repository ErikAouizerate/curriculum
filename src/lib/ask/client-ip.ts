/**
 * The rate-limit identity of a request. Vercel sets `x-real-ip` to a single address; the leading
 * entries of `x-forwarded-for` are client-controlled, so only its last entry is trusted. The
 * identity is the network the address belongs to, hashed so Redis never stores an address.
 */

/** The client address, or `"unknown"` when the platform headers carry nothing usable. */
export function clientIp(headers: Headers): string {
  const raw =
    headers.get("x-real-ip")?.trim() ||
    headers.get("x-forwarded-for")?.split(",").pop()?.trim() ||
    "";
  return validAddress(raw);
}

function validAddress(raw: string): string {
  const address = raw.toLowerCase().replace(/^\[|\]$/g, "").split("%")[0];
  if (!address || address.length > 64) return "unknown";
  const mapped = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/.exec(address);
  const value = mapped?.[1] ?? address;
  return isV4(value) || isV6(value) ? value : "unknown";
}

function isV4(value: string): boolean {
  return !value.includes(":") && /^\d{1,3}(?:\.\d{1,3}){3}$/.test(value);
}

function isV6(value: string): boolean {
  if (!value.includes(":")) return false;
  const [head, tail] = value.split("::");
  const left = head ? head.split(":") : [];
  const right = tail === undefined || tail === "" ? [] : tail.split(":");
  const missing = 8 - left.length - right.length;
  if (missing < 0 || (tail === undefined && left.length !== 8)) return false;
  return [...left, ...right].every((group) => /^[0-9a-f]{1,4}$/.test(group));
}

/**
 * The network an address belongs to: a /64 for IPv6 (a single /64 hands an attacker 2^64
 * addresses, so keying on the address would make the quota free to bypass) and the address
 * itself for IPv4.
 */
export function ipNetwork(ip: string): string {
  if (!isV6(ip)) return ip;
  const [head, tail] = ip.split("::");
  const left = head ? head.split(":") : [];
  const right = tail === undefined || tail === "" ? [] : tail.split(":");
  const groups = [
    ...left,
    ...Array<string>(8 - left.length - right.length).fill("0"),
    ...right,
  ];
  return `${groups
    .slice(0, 4)
    .map((group) => group.padStart(4, "0"))
    .join(":")}::/64`;
}

/** Stable, fixed-length Redis identifier: the address network cannot be read back from it. */
export async function ipKey(ip: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(ipNetwork(ip)),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
