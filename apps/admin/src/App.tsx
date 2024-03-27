import i18n from "@3dwebprodconf/shared/src/utilites/i18n.ts";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";

import { AppContent } from "./AppContent.tsx";
import { setCSSVariables } from "./utilities/CSSVariables.ts";

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

// TODO: Extract default positioning from gltf's scene
// TODO: Refactor add's in code
// TODO: Changeable collision sensitivity
// TODO: Click-away unselect
