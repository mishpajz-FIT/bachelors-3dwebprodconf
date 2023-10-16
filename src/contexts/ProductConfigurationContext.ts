import {createContext, createElement, FC, ReactNode, useContext, useEffect, useState} from "react";

import {ProductConfiguration} from "../interfaces/ProductConfiguration";
import {loadProductConfiguration} from "../services/ProductConfigurationLoader";

const ProductConfigurationContext = createContext<ProductConfiguration| undefined>(undefined);

interface ProductConfigurationProviderProps {
    configUrl: string;
    children: ReactNode;
}

export const ProductConfigurationProvider: FC<ProductConfigurationProviderProps> = ({  configUrl, children }) => {
  const [productConfiguration, setProductConfiguration] = useState<ProductConfiguration | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadProductConfiguration(configUrl);
        setProductConfiguration(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData().catch(error => {
      console.error("An error occurred:", error);
    });
  }, [configUrl]);

  return createElement(
    ProductConfigurationContext.Provider,
    { value: productConfiguration },
    children
  );
};

export const useProductConfiguration = () => {
  const context = useContext(ProductConfigurationContext);
  if (context === undefined) {
    throw new Error('useProductConfiguration must be used within a ProductConfigurationProvider');
  }
  return context;
};
