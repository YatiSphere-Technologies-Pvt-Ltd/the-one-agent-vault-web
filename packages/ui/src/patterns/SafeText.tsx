import { cn } from "../lib/cn";

export interface SafeTextProps {
  /** Untrusted text from servers, skills or users. Rendered as text, never as markup. */
  text: string | null | undefined;
  as?: "span" | "p" | "div";
  className?: string;
}

/** Plain-text rendering with preserved line breaks. Use for every untrusted string. */
export function SafeText({ text, as: Tag = "span", className }: SafeTextProps) {
  return (
    <Tag data-safe-text className={cn("whitespace-pre-wrap break-words", className)}>
      {typeof text === "string" ? text : ""}
    </Tag>
  );
}
