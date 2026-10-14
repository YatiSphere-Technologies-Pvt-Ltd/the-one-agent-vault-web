// Tiny, dependency-free validators for URL search params. Route search validation is loaded
// eagerly with the route tree, so it must stay small (zod would land in every page's bundle).
// Each returns undefined for anything missing or malformed, never throws.

type Raw = Record<string, unknown>;

export const optionalString = (value: unknown): string | undefined =>
  typeof value === "string" && value.length > 0 ? value : typeof value === "number" ? String(value) : undefined;

export const optionalPositiveInt = (value: unknown): number | undefined => {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isInteger(n) && n > 0 ? n : undefined;
};

/** A "flag" param such as ?request=1 (TanStack parses it to the number 1). */
export const optionalOne = (value: unknown): 1 | undefined => (value === 1 || value === "1" ? 1 : undefined);

export const optionalEnum =
  <T extends string>(...allowed: T[]) =>
  (value: unknown): T | undefined =>
    typeof value === "string" && (allowed as string[]).includes(value) ? (value as T) : undefined;

/** Search params produced by a shape: every key optional, as in the URL. */
export type SearchOf<S extends Record<string, (value: unknown) => unknown>> = {
  [K in keyof S]?: Exclude<ReturnType<S[K]>, undefined>;
};

/** Build a validateSearch function from per-key validators; unknown keys are dropped. */
export function searchSchema<S extends Record<string, (value: unknown) => unknown>>(shape: S) {
  return (raw: Raw): SearchOf<S> => {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(shape)) {
      const parsed = shape[key]!(raw[key]);
      if (parsed !== undefined) out[key] = parsed;
    }
    return out as SearchOf<S>;
  };
}
