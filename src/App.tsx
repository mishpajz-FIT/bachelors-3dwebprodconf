import './App.css';

import {ProductEditor} from "./components/3d/ProductEditor.tsx";
import {ProductSpecificationProvider} from "./providers/ProductSpecificationProvider.tsx";

function App() {
  return (
    <>
      <div className="App">
        <ProductSpecificationProvider configUrl="/mockConfiguration3.json">
          <ProductEditor />
        </ProductSpecificationProvider>
      </div>
    </>
  );
}

export default App;
