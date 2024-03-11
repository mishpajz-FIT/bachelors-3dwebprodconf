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
