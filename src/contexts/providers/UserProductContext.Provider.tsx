import {ReactNode, useState} from "react";

import {UserProductContext} from "../UserProductContext.ts";
import {UserProduct} from "../../interfaces/UserProduct.ts";

interface UserProductProviderProps {
    children: ReactNode;
}

export const UserProductProvider = ({children}: UserProductProviderProps) => {
  const [userProduct, setUserProduct] = useState<UserProduct | undefined>(undefined);

  return (
    <UserProductContext.Provider value={[userProduct, setUserProduct]}>
      {children}
    </UserProductContext.Provider>
  );
};
