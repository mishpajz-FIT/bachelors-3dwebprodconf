import './App.css';
// import Experience from './components/Experience';
import { ProductConfigurationPrinter } from './components/ProductConfigurationPrinter';
import { ProductConfigurationProvider } from './contexts/providers/ProductConfigurationContext.Provider';
import {UserProductProvider} from "./contexts/providers/UserProductContext.Provider";

function App() {
  return (
    <>
      <div className="App">
        {/* <Experience /> */}
        <ProductConfigurationProvider configUrl="/mockConfiguration.json">
          <UserProductProvider>
            <ProductConfigurationPrinter />
          </UserProductProvider>
        </ProductConfigurationProvider>
      </div>
    </>
  );
}

export default App;
