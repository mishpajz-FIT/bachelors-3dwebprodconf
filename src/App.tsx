import './App.css';

import {ProductEditor} from "./components/ProductEditor.tsx";
import {ProductConfigurationProvider} from "./providers/ProductConfigurationProvider.tsx";

//TODO: Change naming of ProductConfiguration to remove confusion with UserProduct

function App() {
  return (
    <>
      <div className="App">
        <ProductConfigurationProvider configUrl="/mockConfiguration2.json">
          <ProductEditor />
        </ProductConfigurationProvider>
      </div>
    </>
  );
}

export default App;
