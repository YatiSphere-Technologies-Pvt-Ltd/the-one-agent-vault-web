import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SealGlyph } from "./SealGlyph";

const H = "sha256:9f2c41d0b7a3e5c8f1d24a6b90e7c3f5d81e2a4c6b8d0f1e3a5c7e9b2d4fe81a";

describe("SealGlyph", () => {
  it("is an image with an accessible name", () => {
    render(<SealGlyph hash={H} state="intact" size="md" label="Seal intact: definition matches pinned version 4" />);
    expect(screen.getByRole("img", { name: /seal intact/i })).toBeInTheDocument();
  });

  it("draws ring only below 40 px", () => {
    const { container } = render(<SealGlyph hash={H} state="broken" size="sm" label="Seal broken" />);
    expect(container.querySelector('[data-part="crack"]')).toBeNull();
    expect(container.querySelectorAll("circle")).toHaveLength(2); // ring + break arc
  });

  it("draws break arc and crack when broken at xl", () => {
    const { container } = render(<SealGlyph hash={H} state="broken" size="xl" label="Seal broken" />);
    expect(container.querySelector('[data-part="break-arc"]')).not.toBeNull();
    expect(container.querySelector('[data-part="crack"]')).not.toBeNull();
  });
});
