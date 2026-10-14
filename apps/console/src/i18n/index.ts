import { createI18n, rtlLanguages } from "@agentvault/ui/i18n";
import { appEn } from "./en";

export function createAppI18n() {
  const i18n = createI18n({ resources: { en: { app: appEn } }, defaultNS: "app" });
  const applyLanguage = (lng: string) => {
    document.documentElement.lang = lng;
    document.documentElement.dir = rtlLanguages.has(lng) ? "rtl" : "ltr";
    // IBM Plex Sans Arabic is only downloaded for Arabic.
    if (lng === "ar") void import("@agentvault/ui/arabic.css");
  };
  applyLanguage(i18n.language);
  i18n.on("languageChanged", applyLanguage);
  return i18n;
}
