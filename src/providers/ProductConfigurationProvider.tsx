import {ReactNode, useEffect} from "react";
import {useSnapshot} from "valtio";

import {loadProductConfigurationIntoStore, ProductConfigurationStore} from "../stores/ProductConfigurationStore.ts";



interface ProductConfigurationLoaderProps {
  configUrl: string
  children: ReactNode
}

export const ProductConfigurationProvider = ({ configUrl, children }: ProductConfigurationLoaderProps) => {
  const snap = useSnapshot(ProductConfigurationStore);

  useEffect(() => {
    if (snap.isLoading) {
      loadProductConfigurationIntoStore(configUrl)
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
