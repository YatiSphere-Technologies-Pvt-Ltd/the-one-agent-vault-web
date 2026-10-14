import i18next, { type i18n, type Resource } from "i18next";
import ICU from "i18next-icu";
import { initReactI18next } from "react-i18next";
import { uiEn } from "./en";

export { uiEn };

export interface CreateI18nOptions {
  /** App resources by language and namespace; merged with the UI package's "ui" namespace. */
  resources?: Resource;
  lng?: string;
  defaultNS?: string;
}

/** One i18next instance with ICU messages, shared by the app, Storybook and tests. */
export function createI18n({ resources = {}, lng = "en", defaultNS = "ui" }: CreateI18nOptions = {}): i18n {
  const instance = i18next.createInstance();
  const merged: Resource = { ...resources, en: { ...(resources.en ?? {}), ui: uiEn } };
  void instance
    .use(ICU)
    .use(initReactI18next)
    .init({
      resources: merged,
      lng,
      fallbackLng: "en",
      defaultNS,
      ns: Object.keys(merged.en ?? {}),
      interpolation: { escapeValue: false },
      initAsync: false,
      returnNull: false,
    });
  return instance;
}

/** Right-to-left languages that flip the document direction. */
export const rtlLanguages = new Set(["ar", "he", "fa", "ur"]);
