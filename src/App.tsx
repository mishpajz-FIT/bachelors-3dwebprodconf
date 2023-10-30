import './App.css';

import {ProductEditor} from "./components/ProductEditor.tsx";
import {ProductOptionsProvider} from "./providers/ProductOptionsProvider.tsx";

//TODO: Change naming of ProductConfiguration to remove confusion with UserProduct

function App() {
  return (
    <>
      <div className="App">
        <ProductOptionsProvider configUrl="/mockConfiguration2.json">
          <ProductEditor />
        </ProductOptionsProvider>
      </div>
    </>
  );
}

export default App;
