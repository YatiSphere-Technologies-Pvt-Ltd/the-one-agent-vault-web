import { describe, expect, it } from "vitest";
import { hexOf, sealGeometry } from "./seal-geometry";

const A = "sha256:9f2c41d0b7a3e5c8f1d24a6b90e7c3f5d81e2a4c6b8d0f1e3a5c7e9b2d4fe81a";
const B = "sha256:3b7e0c9a4f12d6e8b5a1c3f7e9d2b4a6c8e0f1d3b5a7c9e2f4d6b8a0c1e3d5f7";

describe("sealGeometry", () => {
  it("is deterministic: the same hash gives the same dashArray and rotation", () => {
    const one = sealGeometry(A, "intact", 96);
    const two = sealGeometry(A, "intact", 96);
    expect(one.dashArray).toBe(two.dashArray);
    expect(one.rotation).toBe(two.rotation);
  });

  it("differs for different hashes", () => {
    const a = sealGeometry(A, "intact", 96);
    const b = sealGeometry(B, "intact", 96);
    expect(a.dashArray).not.toBe(b.dashArray);
    expect(a.rotation).not.toBe(b.rotation);
  });

  it("tiles the ring exactly once", () => {
    const g = sealGeometry(A, "intact", 96);
    const total = g.dashArray.split(" ").map(Number).reduce((x, y) => x + y, 0);
    expect(total).toBeCloseTo(2 * Math.PI * 30, 1);
  });

  it("hides the core below 40 px", () => {
    expect(sealGeometry(A, "intact", 16).showCore).toBe(false);
    expect(sealGeometry(A, "intact", 24).showCore).toBe(false);
    expect(sealGeometry(A, "intact", 40).showCore).toBe(true);
  });

  it("adds breakArc and crackPath only when broken", () => {
    const broken = sealGeometry(A, "broken", 96);
    expect(broken.breakArc).toBeDefined();
    expect(broken.crackPath).toBeDefined();
    for (const state of ["intact", "pending", "revoked"] as const) {
      const g = sealGeometry(A, state, 96);
      expect(g.breakArc).toBeUndefined();
      expect(g.crackPath).toBeUndefined();
    }
  });

  it("accepts bare hex and rejects short hashes", () => {
    expect(hexOf("9F2C41D0B7A3E5C8")).toBe("9f2c41d0b7a3e5c8");
    expect(() => hexOf("sha256:abc")).toThrow();
  });
});
