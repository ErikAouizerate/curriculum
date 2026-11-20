export const HASH_KEY = "cv";

export function readCvCode(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.hash.slice(1)).get(HASH_KEY);
}

export function writeCvCode(code: string, push: boolean, state: unknown = null): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.hash.slice(1));
  params.set(HASH_KEY, code);
  const url = `${window.location.pathname}${window.location.search}#${params.toString()}`;
  if (push) {
    window.history.pushState(state, "", url);
  } else {
    window.history.replaceState(state, "", url);
  }
}
