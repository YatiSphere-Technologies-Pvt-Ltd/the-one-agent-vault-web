// StatusVocabulary: the only status texts the product may show, and their tones.

export type StatusTone = "success" | "info" | "held" | "danger" | "neutral";

export const StatusVocabulary = {
  Approved: "approved",
  Enabled: "enabled",
  Allowed: "allowed",
  InSync: "inSync",
  Resolved: "resolved",
  InReview: "inReview",
  Onboarding: "onboarding",
  Pending: "pending",
  Escalated: "escalated",
  ChangesRequested: "changesRequested",
  HeldDefinitionChanged: "heldDefinitionChanged",
  RequiresApproval: "requiresApproval",
  Warned: "warned",
  Redacted: "redacted",
  OutOfDate: "outOfDate",
  Modified: "modified",
  AcceptedRisk: "acceptedRisk",
  Blocked: "blocked",
  Denied: "denied",
  Error: "error",
  Unmanaged: "unmanaged",
  Draft: "draft",
  Disabled: "disabled",
  Deprecated: "deprecated",
  Expired: "expired",
  AgentOffline: "agentOffline",
} as const;

export type StatusVocabulary = (typeof StatusVocabulary)[keyof typeof StatusVocabulary];

export const statusTone: Record<StatusVocabulary, StatusTone> = {
  approved: "success",
  enabled: "success",
  allowed: "success",
  inSync: "success",
  resolved: "success",
  inReview: "info",
  onboarding: "info",
  pending: "info",
  escalated: "info",
  changesRequested: "held",
  heldDefinitionChanged: "held",
  requiresApproval: "held",
  warned: "held",
  redacted: "held",
  outOfDate: "held",
  modified: "held",
  acceptedRisk: "held",
  blocked: "danger",
  denied: "danger",
  error: "danger",
  unmanaged: "danger",
  draft: "neutral",
  disabled: "neutral",
  deprecated: "neutral",
  expired: "neutral",
  agentOffline: "neutral",
};

/** i18n key for a status label (namespace "ui"). */
export const statusLabelKey = (status: StatusVocabulary) => `status.${status}` as const;

/** Tailwind classes per tone. Literal strings so Tailwind can find them. */
export const toneClasses: Record<StatusTone, { fg: string; bg: string; border: string; solid: string }> = {
  success: {
    fg: "text-status-success-fg",
    bg: "bg-status-success-bg",
    border: "border-status-success-border",
    solid: "bg-status-success-solid",
  },
  info: {
    fg: "text-status-info-fg",
    bg: "bg-status-info-bg",
    border: "border-status-info-border",
    solid: "bg-status-info-solid",
  },
  held: {
    fg: "text-status-held-fg",
    bg: "bg-status-held-bg",
    border: "border-status-held-border",
    solid: "bg-status-held-solid",
  },
  danger: {
    fg: "text-status-danger-fg",
    bg: "bg-status-danger-bg",
    border: "border-status-danger-border",
    solid: "bg-status-danger-solid",
  },
  neutral: {
    fg: "text-status-neutral-fg",
    bg: "bg-status-neutral-bg",
    border: "border-status-neutral-border",
    solid: "bg-status-neutral-solid",
  },
};
