import './App.css';
import { ProductConfigurationProvider } from './contexts/providers/ProductConfigurationContext.Provider';
import {UserProductProvider} from "./contexts/providers/UserProductContext.Provider";
import {ProductEditor} from "./components/ProductEditor.tsx";

function App() {
  return (
    <>
      <div className="App">
        <ProductConfigurationProvider configUrl="/mockConfiguration2.json">
          <UserProductProvider>
            <ProductEditor />
          </UserProductProvider>
        </ProductConfigurationProvider>
      </div>
    </>
  );
}

export default App;
