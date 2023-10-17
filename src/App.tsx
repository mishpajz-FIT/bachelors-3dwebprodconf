import './App.css';
// import Experience from './components/Experience';
import { ProductConfigurationPrinter } from './components/ProductConfigurationPrinter';
import { ProductConfigurationProvider } from './contexts/ProductConfigurationContext.Provider';

function App() {
  return (
    <>
      <div className="App">
        {/* <Experience /> */}
        <ProductConfigurationProvider configUrl="/mockConfiguration.json">
          <ProductConfigurationPrinter />
        </ProductConfigurationProvider>
      </div>
    </>
  );
}

export default App;
