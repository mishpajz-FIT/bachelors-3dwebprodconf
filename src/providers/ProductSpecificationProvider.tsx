import {ReactNode, useEffect} from "react";
import {useSnapshot} from "valtio";

import {loadProductSpecification} from "../services/ProductSpecificationLoader.ts";
import {storeProductSpecification} from "../stores/actions/ProductSpecificationActions.ts";
import {ProductSpecificationStore} from "../stores/ProductSpecificationStore.ts";

interface ProductSpecificationProviderProps {
  configUrl: string
  children: ReactNode
}

export const ProductSpecificationProvider = ({ configUrl, children }: ProductSpecificationProviderProps) => {
  const productSpecsSnap = useSnapshot(ProductSpecificationStore);

  useEffect(() => {
    if (ProductSpecificationStore.isLoading) {
      storeProductSpecification(() => loadProductSpecification(configUrl))
        .catch(error => {
          console.error("Error loading product configuration:", error);
        });
    }
  }, [configUrl, productSpecsSnap.isLoading]);

  if (productSpecsSnap.isLoading) {
    return <div>Loading...</div>;
  }

  if (productSpecsSnap.error) {
    return <div>Error loading configuration: {productSpecsSnap.error.message}</div>;
  }

  return children;
};
