import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "@agentvault/ui";
import { readScenario, writeScenario, type MockScenario } from "../../mocks/scenario";
import { setFlag, useFlags } from "../../flags";

/** Development toggle for release flags, in the avatar menu. */
export function FlagToggles() {
  const { t } = useTranslation("app");
  const { t: tu } = useTranslation("ui");
  const flags = useFlags();
  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuLabel>{tu("shell.previewFeatures")}</DropdownMenuLabel>
      <DropdownMenuCheckboxItem
        checked={flags.R2}
        onCheckedChange={(on) => setFlag("R2", on === true)}
        onSelect={(e) => e.preventDefault()}
      >
        {t("flags.r2")}
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={flags.R3}
        onCheckedChange={(on) => setFlag("R3", on === true)}
        onSelect={(e) => e.preventDefault()}
      >
        {t("flags.r3")}
      </DropdownMenuCheckboxItem>
      {(import.meta.env.DEV || import.meta.env.VITE_MOCK_API === "true") && <MockScenarioToggle />}
    </>
  );
}

/** Development only: switch the mock API between normal, empty, error and slow responses. */
function MockScenarioToggle() {
  const { t } = useTranslation("app");
  const queryClient = useQueryClient();
  const [scenario, setScenario] = useState<MockScenario>(readScenario);
  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuLabel>{t("mock.label")}</DropdownMenuLabel>
      <DropdownMenuRadioGroup
        value={scenario}
        onValueChange={(v) => {
          writeScenario(v as MockScenario);
          setScenario(v as MockScenario);
          void queryClient.resetQueries();
        }}
      >
        {(["normal", "empty", "error", "slow"] as const).map((s) => (
          <DropdownMenuRadioItem key={s} value={s} onSelect={(e) => e.preventDefault()}>
            {t(`mock.${s}`)}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </>
  );
}
