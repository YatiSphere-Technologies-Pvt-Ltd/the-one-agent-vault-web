interface ImportMetaEnv {
  /** Where the design-partner form posts (JSON). Unset: the form shows "Form not connected yet". */
  readonly PUBLIC_LEAD_ENDPOINT?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
