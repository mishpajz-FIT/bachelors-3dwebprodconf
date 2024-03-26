import { useEffect } from "react";

import { AppContent } from "./AppContent.tsx";
import { setCSSVariables } from "./utilities/CSSVariables.ts";

function App() {
  useEffect(() => {
    setCSSVariables();
  }, []);

  return <AppContent />;
}

export default App;

// TODO: Extract default positioning from gltf's scene
// TODO: Refactor add's in code
// TODO: Changeable collision sensitivity
// TODO: Click-away unselect
