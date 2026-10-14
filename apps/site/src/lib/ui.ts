// Server-side setup for rendering @agentvault/ui React components to HTML at build time.
import { createI18n } from "@agentvault/ui/i18n";

createI18n();

export { SealGlyph, StatusPill, Strip, StripList, sealGeometry, toneClasses } from "@agentvault/ui";
