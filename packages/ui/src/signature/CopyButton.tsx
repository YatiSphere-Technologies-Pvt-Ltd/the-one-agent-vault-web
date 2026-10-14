import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Copy } from "lucide-react";
import { Button } from "../primitives/button";

/** Icon button that copies a value and announces the result. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const { t } = useTranslation("ui");
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        iconOnly
        aria-label={label}
        onClick={() => {
          void navigator.clipboard?.writeText(value).then(() => setCopied(true));
        }}
      >
        {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
      </Button>
      <span className="sr-only" aria-live="polite">
        {copied ? t("common.copied") : ""}
      </span>
    </>
  );
}
