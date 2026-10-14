import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge must know the AgentVault type scale, otherwise `text-label text-ink-muted`
// would be treated as two colours and one dropped.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "title-1",
            "title-2",
            "title-3",
            "body",
            "body-sm",
            "label",
            "caption",
            "mono",
            "mono-sm",
          ],
        },
      ],
      shadow: [{ shadow: ["overlay", "dialog"] }],
      rounded: [{ rounded: ["none", "control", "panel", "overlay", "pill"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
