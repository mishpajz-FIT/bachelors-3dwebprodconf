import {ReactNode, useState} from "react";

import {UserProduct} from "../../interfaces/UserProduct";
import {UserProductContext} from "../UserProductContext";

interface UserProductProviderProps {
    children: ReactNode;
}

export const UserProductProvider = ({children}: UserProductProviderProps) => {
  const newProduct: UserProduct = {
    baseComponentId: "0",
    configuredMaterials: [],
    attachedComponents: []
  };
    
  const [userProduct, setUserProduct] = useState<UserProduct | undefined>(newProduct);

  return (
    <UserProductContext.Provider value={[userProduct, setUserProduct]}>
      {children}
    </UserProductContext.Provider>
  );
};
