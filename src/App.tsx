import "./App.css";

import { ProductEditor } from "./components/2d/concrete/ProductEditor/ProductEditor.tsx";
import { ProductSpecificationProvider } from "./providers/ProductSpecificationProvider.tsx";

function App() {
  return (
    <>
      <div className="App flex h-screen flex-col">
        <div className="z-10 border-b border-gray-200 bg-white p-2 shadow-sm dark:border-gray-600 dark:bg-gray-900">
          <img src={"vite.svg"} alt={"logo"} className="ml-2 max-h-12" />
        </div>

        <ProductSpecificationProvider configUrl="/mockConfiguration.json">
          <ProductEditor />
        </ProductSpecificationProvider>
      </div>
    </>
  );
}

export default App;
