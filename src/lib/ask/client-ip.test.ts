import { describe, expect, it } from "vitest";

import { clientIp, ipKey, ipNetwork } from "#lib/ask/client-ip.js";

const headers = (values: Record<string, string>) => new Headers(values);

describe("clientIp", () => {
  it("prefers the platform header over the forwarded chain", () => {
    expect(
      clientIp(headers({ "x-real-ip": "203.0.113.7", "x-forwarded-for": "1.2.3.4, 203.0.113.7" })),
    ).toBe("203.0.113.7");
  });

  it("trusts the last entry of x-forwarded-for, never the client-controlled first one", () => {
    expect(clientIp(headers({ "x-forwarded-for": "6.6.6.6, 203.0.113.7" }))).toBe("203.0.113.7");
  });

  it("unwraps IPv4-mapped IPv6 addresses", () => {
    expect(clientIp(headers({ "x-real-ip": "::ffff:203.0.113.7" }))).toBe("203.0.113.7");
  });

  it("falls back to a single bucket without a usable address", () => {
    expect(clientIp(headers({}))).toBe("unknown");
    expect(clientIp(headers({ "x-real-ip": "not-an-ip" }))).toBe("unknown");
    expect(clientIp(headers({ "x-real-ip": "1.2.3" }))).toBe("unknown");
    expect(clientIp(headers({ "x-real-ip": "1:2:3:4:5:6:7:8:9" }))).toBe("unknown");
  });
});

describe("ipNetwork", () => {
  it("keeps IPv4 addresses", () => {
    expect(ipNetwork("203.0.113.7")).toBe("203.0.113.7");
  });

  it("reduces IPv6 to a /64", () => {
    expect(ipNetwork("2001:db8::1")).toBe("2001:0db8:0000:0000::/64");
    expect(ipNetwork("2001:db8:0:0:1:2:3:4")).toBe("2001:0db8:0000:0000::/64");
    expect(ipNetwork("::1")).toBe("0000:0000:0000:0000::/64");
  });
});

describe("ipKey", () => {
  it("is stable for a whole /64 and differs across networks", async () => {
    const a = await ipKey("2001:db8:0:0:1:2:3:4");
    expect(await ipKey("2001:db8::ffff")).toBe(a);
    expect(await ipKey("2001:db8:0:1::1")).not.toBe(a);
  });

  it("hides the address", async () => {
    const key = await ipKey("203.0.113.7");
    expect(key).toMatch(/^[0-9a-f]{64}$/);
    expect(key).not.toContain("203");
  });
});
