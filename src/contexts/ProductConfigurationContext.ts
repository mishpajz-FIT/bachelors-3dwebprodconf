import {createContext, useContext} from "react";

import {ProductConfiguration} from "../interfaces/ProductConfiguration.ts";

export const ProductConfigurationContext = createContext<ProductConfiguration| undefined>(undefined);

export const useProductConfiguration = () => {
  return useContext(ProductConfigurationContext);
};
