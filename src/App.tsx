import './App.css';

import {ProductEditor} from "./components/3d/ProductEditor.tsx";
import {ProductOptionsProvider} from "./providers/ProductOptionsProvider.tsx";

function App() {
  return (
    <>
      <div className="App">
        <ProductOptionsProvider configUrl="/mockConfiguration3.json">
          <ProductEditor />
        </ProductOptionsProvider>
      </div>
    </>
  );
}

export default App;
