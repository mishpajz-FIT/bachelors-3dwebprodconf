import { useState } from "react";

import { ProductConfirmation } from "./components/2d/concrete/ProductConfirmation/ProductConfirmation.tsx";
import { ProductEditor } from "./components/2d/concrete/ProductEditor/ProductEditor.tsx";
import { ProductSelection } from "./components/2d/concrete/ProductSelection/ProductSelection.tsx";

enum AppPhase {
  Selection,
  Editor,
  Confirmation,
}

export const AppContent = () => {
  const [phase, setPhase] = useState(AppPhase.Selection);

  return (
    <div className="App flex h-screen flex-col">
      <div className="z-10 border-b border-gray-200 bg-white p-2 shadow-sm dark:border-gray-600 dark:bg-gray-900">
        <img src={"vite.svg"} alt={"logo"} className="ml-2 max-h-12" />
      </div>

      {phase === AppPhase.Selection && (
        <ProductSelection onSelect={() => setPhase(AppPhase.Editor)} />
      )}

      {phase === AppPhase.Editor && (
        <ProductEditor onDone={() => setPhase(AppPhase.Confirmation)} />
      )}

      {phase === AppPhase.Confirmation && (
        <ProductConfirmation onClose={() => setPhase(AppPhase.Editor)} />
      )}
    </div>
  );
};
