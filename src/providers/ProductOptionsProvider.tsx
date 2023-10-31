import {ReactNode, useEffect} from "react";
import {useSnapshot} from "valtio";

import {loadProductOptionsIntoStore, ProductOptionsStore} from "../stores/ProductOptionsStore.ts";



interface ProductOptionsProviderProps {
  configUrl: string
  children: ReactNode
}

export const ProductOptionsProvider = ({ configUrl, children }: ProductOptionsProviderProps) => {
  const snap = useSnapshot(ProductOptionsStore);

  useEffect(() => {
    if (snap.isLoading) {
      loadProductOptionsIntoStore(configUrl)
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
