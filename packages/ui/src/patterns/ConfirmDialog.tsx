import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../primitives/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../primitives/dialog";
import { Field } from "../primitives/field";
import { Input } from "../primitives/input";
import { notify } from "../primitives/sonner";
import { Textarea } from "../primitives/textarea";

export type ConfirmTier = 0 | 1 | 2 | 3;

export interface ConfirmResult {
  reason?: string;
  /** Tier 3: saved as a proposal for a second administrator. */
  proposal?: boolean;
}

export interface ConfirmDialogProps {
  /**
   * 0: no dialog, run at once and offer Undo in a toast.
   * 1: impact summary.
   * 2: impact summary + mandatory reason + type the object's name.
   * 3: as 2, but saves a proposal a second administrator must approve.
   */
  tier: ConfirmTier;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Dialog title, e.g. "Disable salesforce-crm?" */
  title: string;
  /** Verb on the confirm button, e.g. "Disable server". */
  actionLabel: string;
  onConfirm: (result: ConfirmResult) => void;
  /** Tiers 1–3. */
  impact?: ReactNode;
  /** Tiers 2–3: the name the user must type. */
  objectName?: string;
  /** Tier 0: undo handler for the toast. */
  onUndo?: () => void;
  /** Tier 0: toast message; defaults to "{actionLabel} done". */
  doneMessage?: string;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const { tier, open, onOpenChange, onConfirm, onUndo, actionLabel, doneMessage } = props;
  const { t } = useTranslation("ui");
  const ran = useRef(false);

  // Tier 0: no dialog. Act immediately and offer Undo.
  useEffect(() => {
    if (tier !== 0) return;
    if (!open) {
      ran.current = false;
      return;
    }
    if (ran.current) return;
    ran.current = true;
    onConfirm({});
    notify.success(doneMessage ?? t("confirm.done", { action: actionLabel }), onUndo ? { onUndo } : undefined);
    onOpenChange(false);
  }, [tier, open, onConfirm, onOpenChange, onUndo, actionLabel, doneMessage, t]);

  if (tier === 0) return null;
  return <TieredDialog {...props} tier={tier} />;
}

function TieredDialog(props: ConfirmDialogProps & { tier: 1 | 2 | 3 }) {
  const { tier, open, onOpenChange } = props;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent width={tier === 1 ? "confirm" : "form"}>
        {/* Mounted only while open, so the reason and typed name reset on every opening. */}
        <ConfirmForm {...props} />
      </DialogContent>
    </Dialog>
  );
}

function ConfirmForm({
  tier,
  onOpenChange,
  title,
  actionLabel,
  onConfirm,
  impact,
  objectName,
}: ConfirmDialogProps & { tier: 1 | 2 | 3 }) {
  const { t } = useTranslation("ui");
  const [reason, setReason] = useState("");
  const [typed, setTyped] = useState("");
  const [touched, setTouched] = useState(false);
  const formId = useId();

  const needsReason = tier >= 2;
  const needsName = tier >= 2 && Boolean(objectName);
  const reasonOk = !needsReason || reason.trim().length > 0;
  const nameOk = !needsName || typed === objectName;
  const canConfirm = reasonOk && nameOk;

  const submit = () => {
    setTouched(true);
    if (!canConfirm) return;
    onConfirm({
      ...(needsReason ? { reason: reason.trim() } : {}),
      ...(tier === 3 ? { proposal: true } : {}),
    });
    onOpenChange(false);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription className={impact ? "sr-only" : undefined}>{t("confirm.impact")}</DialogDescription>
      </DialogHeader>
      <form
        id={formId}
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        {impact && (
          <section aria-label={t("confirm.impact")} className="rounded-panel border border-edge bg-sunken p-4 text-body">
            <h3 className="m-0 mb-2 text-label text-ink-muted">{t("confirm.impact")}</h3>
            {impact}
          </section>
        )}
        {needsReason && (
          <Field
            label={t("confirm.reason")}
            help={t("confirm.reasonHelp")}
            error={touched && !reasonOk ? t("common.required") : undefined}
          >
            <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} required />
          </Field>
        )}
        {needsName && objectName && (
          <Field label={t("confirm.typeName", { name: objectName })}>
            <Input mono value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" spellCheck={false} />
          </Field>
        )}
        {tier === 3 && <p className="m-0 text-body-sm text-ink-secondary">{t("confirm.proposalNote")}</p>}
      </form>
      <DialogFooter>
        <Button variant="secondary" onClick={() => onOpenChange(false)}>
          {t("common.cancel")}
        </Button>
        <Button
          type="submit"
          form={formId}
          variant={tier === 3 ? "primary" : "danger"}
          disabled={tier >= 2 && !canConfirm}
        >
          {tier === 3 ? t("confirm.saveProposal") : actionLabel}
        </Button>
      </DialogFooter>
    </>
  );
}
