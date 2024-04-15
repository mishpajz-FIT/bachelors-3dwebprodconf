import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";

import { AppContent } from "./AppContent.tsx";
import { setCSSVariables } from "./utilities/CSSVariables.ts";
import i18n from "./utilities/i18n.ts";

function App() {
  useEffect(() => {
    setCSSVariables();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <AppContent />
    </I18nextProvider>
  );
}

export default App;

// TODO: Refactor add's in code
// TODO: Minify bundle size
// TODO: add CAPTCHA
