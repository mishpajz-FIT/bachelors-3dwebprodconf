import {ReactNode, useEffect} from "react";
import {useSnapshot} from "valtio";

import {loadProductOptions} from "../services/ProductOptionsLoader.ts";
import {storeProductOptions} from "../stores/actions/ProductOptionsActions.ts";
import {ProductOptionsStore} from "../stores/ProductOptionsStore.ts";

interface ProductOptionsProviderProps {
  configUrl: string
  children: ReactNode
}

export const ProductOptionsProvider = ({ configUrl, children }: ProductOptionsProviderProps) => {
  const snap = useSnapshot(ProductOptionsStore);

  useEffect(() => {
    if (snap.isLoading) {
      storeProductOptions(() => loadProductOptions(configUrl))
        .catch(error => {
          console.error("Error loading product configuration:", error);
        });
    }
  }, [configUrl, snap.isLoading]);

  if (snap.isLoading) {
    return <div>Loading...</div>;
  }

  if (snap.error) {
    return <div>Error loading configuration: {snap.error.message}</div>;
  }

  return children;
};
