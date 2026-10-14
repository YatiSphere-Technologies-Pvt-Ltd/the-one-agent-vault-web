import * as React from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, TriangleAlert } from "lucide-react";
import { cn } from "../lib/cn";
import { controlClasses, useFieldControlProps } from "./field";

export type PasswordInputProps = Omit<React.ComponentProps<"input">, "type">;

/** Password field with a show/hide toggle and a Caps Lock warning. */
function PasswordInput({ className, onKeyUp, onBlur, ...props }: PasswordInputProps) {
  const { t } = useTranslation("ui");
  const [visible, setVisible] = React.useState(false);
  const [capsLock, setCapsLock] = React.useState(false);
  const fieldProps = useFieldControlProps(props);
  const capsId = React.useId();
  const describedBy = [fieldProps["aria-describedby"], capsLock ? capsId : undefined].filter(Boolean).join(" ") || undefined;
  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          data-slot="password-input"
          className={cn(controlClasses, "h-(--av-size-control-md) ps-3 pe-12", className)}
          onKeyUp={(e) => {
            setCapsLock(e.getModifierState?.("CapsLock") ?? false);
            onKeyUp?.(e);
          }}
          onBlur={(e) => {
            setCapsLock(false);
            onBlur?.(e);
          }}
          {...props}
          {...fieldProps}
          aria-describedby={describedBy}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          aria-label={visible ? t("password.hide") : t("password.show")}
          className="absolute inset-y-0 end-0 inline-flex w-(--av-size-control-md) items-center justify-center rounded-control text-ink-muted hover:text-ink"
        >
          {visible ? <EyeOff aria-hidden className="size-4" /> : <Eye aria-hidden className="size-4" />}
        </button>
      </div>
      {capsLock && (
        <p id={capsId} className="m-0 flex items-center gap-1 text-caption text-status-held-fg">
          <TriangleAlert aria-hidden className="size-3" />
          {t("password.capsLock")}
        </p>
      )}
    </div>
  );
}

export { PasswordInput };
