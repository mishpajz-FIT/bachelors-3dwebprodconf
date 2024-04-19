import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

import { globalConfig } from "../configurations/Config.ts";

export function configureI18n() {
  // eslint-disable-next-line import/no-named-as-default-member
  i18n
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: globalConfig.config.ui.languages.default,
      supportedLngs: globalConfig.config.ui.languages.all,
      load: "all",
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ["querystring", "path", "localStorage", "navigator", "htmlTag"],
        caches: ["localStorage"],
      },
      react: {
        useSuspense: false,
      },
    })
    .catch((error) => console.error("i18n error: ", error));

  return i18n;
}
