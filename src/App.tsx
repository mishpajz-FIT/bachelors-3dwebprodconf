import "./App.css";

import { ProductEditor } from "./components/3d/ProductEditor.tsx";
import { ProductSpecificationProvider } from "./providers/ProductSpecificationProvider.tsx";

function App() {
  return (
    <>
      <div className="App flex h-screen flex-col">
        <div className="z-10 border-b border-gray-200 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-900">
          <span className="font-bold">logo!</span>
        </div>

        <ProductSpecificationProvider configUrl="/mockConfiguration.json">
          <ProductEditor />
        </ProductSpecificationProvider>
      </div>
    </>
  );
}

export default App;
