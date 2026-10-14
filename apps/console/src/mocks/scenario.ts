// Development switch for the mock API: see every screen's empty, error and loading states.
import { storage } from "@agentvault/ui";

export type MockScenario = "normal" | "empty" | "error" | "slow";
export const MOCK_SCENARIO_KEY = "av.mock.scenario";

export function readScenario(): MockScenario {
  const v = storage.get(MOCK_SCENARIO_KEY);
  return v === "empty" || v === "error" || v === "slow" ? v : "normal";
}

export function writeScenario(s: MockScenario) {
  storage.set(MOCK_SCENARIO_KEY, s);
}
