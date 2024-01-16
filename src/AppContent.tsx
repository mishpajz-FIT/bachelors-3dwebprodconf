import { ProductEditor } from "./components/2d/concrete/ProductEditor/ProductEditor.tsx";

import { useState } from "react";

import { ProductConfirmation } from "./components/2d/concrete/ProductConfirmation/ProductConfirmation.tsx";

enum AppPhase {
  Editor,
  Confirmation,
}

export const AppContent = () => {
  const [phase, setPhase] = useState(AppPhase.Editor);

  return (
    <div className="App flex h-screen flex-col">
      <div className="z-10 border-b border-gray-200 bg-white p-2 shadow-sm dark:border-gray-600 dark:bg-gray-900">
        <img src={"vite.svg"} alt={"logo"} className="ml-2 max-h-12" />
      </div>

      {phase === AppPhase.Editor && (
        <ProductEditor onDone={() => setPhase(AppPhase.Confirmation)} />
      )}

      {phase === AppPhase.Confirmation && <ProductConfirmation />}
    </div>
  );
};
