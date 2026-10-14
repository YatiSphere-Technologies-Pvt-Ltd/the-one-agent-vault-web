import * as React from "react";
import { useTranslation } from "react-i18next";
import { CircleAlert } from "lucide-react";
import { cn } from "../lib/cn";
import { Label } from "./label";

interface FieldContextValue {
  id: string;
  describedBy: string | undefined;
  invalid: boolean;
}

const FieldContext = React.createContext<FieldContextValue | null>(null);

/** Read by Input, Textarea, Select and Combobox to wire id, aria-describedby and aria-invalid. */
export function useField(): FieldContextValue | null {
  return React.useContext(FieldContext);
}

export interface FieldProps {
  label: React.ReactNode;
  /** Help text below the control. Replaced by `error` when present. */
  help?: React.ReactNode;
  error?: React.ReactNode;
  optional?: boolean;
  id?: string;
  className?: string;
  children: React.ReactNode;
}

/** Label above, help or error below, aria-describedby wired to the control. */
export function Field({ label, help, error, optional, id, className, children }: FieldProps) {
  const { t } = useTranslation("ui");
  const autoId = React.useId();
  const controlId = id ?? `field-${autoId}`;
  const messageId = `${controlId}-message`;
  const hasMessage = Boolean(error ?? help);
  const value = React.useMemo(
    () => ({ id: controlId, describedBy: hasMessage ? messageId : undefined, invalid: Boolean(error) }),
    [controlId, hasMessage, messageId, error],
  );
  return (
    <FieldContext.Provider value={value}>
      <div className={cn("flex flex-col gap-1", className)}>
        <Label htmlFor={controlId}>
          {label}
          {optional && <span className="font-normal text-ink-muted"> ({t("field.optional")})</span>}
        </Label>
        {children}
        {error ? (
          <p id={messageId} className="flex items-start gap-1 text-caption text-status-danger-fg">
            <CircleAlert aria-hidden className="mt-0.5 size-3 shrink-0" />
            <span>
              <span className="sr-only">{t("common.error")}: </span>
              {error}
            </span>
          </p>
        ) : help ? (
          <p id={messageId} className="text-caption text-ink-muted">
            {help}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}

/** Shared control look: height 36, 1px strong edge, control radius, surface background. */
export const controlClasses = cn(
  "w-full min-w-0 rounded-control border border-edge-strong bg-surface text-body text-ink",
  "placeholder:text-ink-muted transition-colors duration-(--av-motion-fast)",
  "disabled:cursor-not-allowed disabled:bg-sunken disabled:text-ink-disabled disabled:border-edge",
  "aria-invalid:border-status-danger-solid",
);

/** Props a control takes from the surrounding Field. */
export function useFieldControlProps(props: {
  id?: string | undefined;
  "aria-describedby"?: string | undefined;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
}) {
  const field = useField();
  return {
    id: props.id ?? field?.id,
    "aria-describedby": props["aria-describedby"] ?? field?.describedBy,
    "aria-invalid": props["aria-invalid"] ?? (field?.invalid || undefined),
  };
}
