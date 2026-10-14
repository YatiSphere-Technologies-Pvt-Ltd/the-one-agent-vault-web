import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { semanticColors, tokens } from "./dist/tokens";

const here = dirname(fileURLToPath(import.meta.url));
const strip = (s: string) => s.replace(/\n$/, "");

describe("tokens build", () => {
  execFileSync(process.execPath, [join(here, "build.mjs")]);
  const css = readFileSync(join(here, "dist/tokens.css"), "utf8");

  it("reproduces kickoff/reference/tokens.css byte for byte", () => {
    const reference = readFileSync(join(here, "../../kickoff/reference/tokens.css"), "utf8");
    expect(strip(css)).toBe(strip(reference));
  });

  it("has 71 semantic colours, each resolved in both themes", () => {
    expect(semanticColors).toHaveLength(71);
    for (const name of semanticColors) {
      expect(tokens.color.light[name]).toMatch(/^#[0-9A-F]{6}$/);
      expect(tokens.color.dark[name]).toMatch(/^#[0-9A-F]{6}$/);
      expect(css).toContain(`--av-${name}: var(--av-`);
    }
  });

  it("leaves no unresolved {…} references", () => {
    expect(css).not.toMatch(/\{[a-z]/);
    expect(JSON.stringify(tokens)).not.toMatch(/\{color\./);
  });
});
