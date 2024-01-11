import './App.css';

import {ProductEditor} from "./components/3d/ProductEditor.tsx";
import {ProductSpecificationProvider} from "./providers/ProductSpecificationProvider.tsx";

function App() {
  return (
    <>
      <div className="App flex h-screen flex-col">
        <div className="border-b border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-900">
          logo!
        </div>

        <ProductSpecificationProvider configUrl="/mockConfiguration.json">
          <ProductEditor />
        </ProductSpecificationProvider>
      </div>
    </>
  );
}

export default App;
