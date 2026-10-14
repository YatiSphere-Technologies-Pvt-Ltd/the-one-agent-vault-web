/** localStorage access that never throws (private windows, blocked storage, tests). */
export const storage = {
  get(key: string): string | null {
    try {
      return globalThis.localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      globalThis.localStorage?.setItem(key, value);
    } catch {
      // storage unavailable: preference lasts for this session only
    }
  },
};
