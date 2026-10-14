import { describe, expect, it } from "vitest";
import { StatusVocabulary, statusTone, toneClasses } from "./status";
import { uiEn } from "./i18n/en";
import { riskLevel } from "./signature/RiskChip";

const expected = {
  success: ["Approved", "Enabled", "Allowed", "In sync", "Resolved"],
  info: ["In review", "Onboarding", "Pending", "Escalated"],
  held: [
    "Changes requested",
    "Held (definition changed)",
    "Requires approval",
    "Warned",
    "Redacted",
    "Out of date",
    "Modified",
    "Accepted risk",
  ],
  danger: ["Blocked", "Denied", "Error", "Unmanaged"],
  neutral: ["Draft", "Disabled", "Deprecated", "Expired", "Agent offline"],
} as const;

describe("StatusVocabulary", () => {
  it("maps every status to the tone in the specification", () => {
    const actual: Record<string, string[]> = { success: [], info: [], held: [], danger: [], neutral: [] };
    for (const status of Object.values(StatusVocabulary)) actual[statusTone[status]]?.push(uiEn.status[status]);
    expect(actual).toEqual(expected);
  });

  it("has a label and tone classes for every status", () => {
    for (const status of Object.values(StatusVocabulary)) {
      expect(uiEn.status[status]).toBeTruthy();
      expect(toneClasses[statusTone[status]].fg).toMatch(/^text-status-/);
    }
  });
});

describe("riskLevel", () => {
  it.each([
    [0, "low"],
    [24, "low"],
    [25, "medium"],
    [49, "medium"],
    [50, "high"],
    [74, "high"],
    [75, "critical"],
    [100, "critical"],
  ])("%i → %s", (score, level) => {
    expect(riskLevel(score)).toBe(level);
  });
});
