import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["querystring", "cookie", "localStorage", "path", "subdomain"],
      caches: ["cookie"],
    },
  })
  .catch((error) => console.error("i18n error: ", error));

export default i18n;
