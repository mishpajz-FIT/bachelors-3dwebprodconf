import {ReactNode, useEffect, useState} from "react";

import { ProductConfigurationContext } from "../ProductConfigurationContext.ts";
import {ProductConfiguration} from "../../interfaces/ProductConfiguration.ts";
import {loadProductConfiguration} from "../../services/ProductConfigurationLoader.ts";

interface ProductConfigurationProviderProps {
    configUrl: string;
    children: ReactNode;
}

export const ProductConfigurationProvider = ({  configUrl, children }: ProductConfigurationProviderProps) => {
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

  return (
    <ProductConfigurationContext.Provider value={productConfiguration}>
      {children}
    </ProductConfigurationContext.Provider>
  );
};
