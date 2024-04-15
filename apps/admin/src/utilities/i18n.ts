import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  })
  .catch((error) => console.error("i18n error: ", error));

export default i18n;
