import "./App.css";

import { useContext, useEffect } from "react";

import { ProductEditor } from "./components/2d/concrete/ProductEditor/ProductEditor.tsx";
import { ConfigContext } from "./configurations/contexts/ConfigContext.ts";
import { ProductSpecificationProvider } from "./providers/ProductSpecificationProvider.tsx";

function App() {
  const appConfig = useContext(ConfigContext);

  useEffect(() => {
    const setCSSVariables = () => {
      const root = document.documentElement;

      root.style.setProperty(
        "--primary-light",
        appConfig.ui.colors.primary.light
      );
      root.style.setProperty(
        "--primary-dark",
        appConfig.ui.colors.primary.light
      );

      root.style.setProperty(
        "--primary-overlay-light",
        appConfig.ui.colors.primary.overlayTextWhiteLight
          ? "rgb(255 255 255)"
          : "rgb(2 6 23)"
      );

      root.style.setProperty(
        "--primary-overlay-dark",
        appConfig.ui.colors.primary.overlayTextWhiteDark
          ? "rgb(255 255 255)"
          : "rgb(2 6 23)"
      );
    };

    setCSSVariables();
  }, [appConfig]);

  return (
    <>
      <div className="App flex h-screen flex-col">
        <div className="z-10 border-b border-gray-200 bg-white p-2 shadow-sm dark:border-gray-600 dark:bg-gray-900">
          <img src={"vite.svg"} alt={"logo"} className="ml-2 max-h-12" />
        </div>

        <ProductSpecificationProvider configUrl={"/mockConfiguration.json"}>
          <ProductEditor />
        </ProductSpecificationProvider>
      </div>
    </>
  );
}

export default App;
