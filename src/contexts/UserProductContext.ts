import {createContext, Dispatch, SetStateAction, useContext} from "react";

import {UserProduct} from "../interfaces/UserProduct.ts";

export const UserProductContext = createContext<
        [ UserProduct | undefined, Dispatch<SetStateAction<UserProduct | undefined>> ] | undefined
    >(undefined);

export const useUserProduct = (): [UserProduct | undefined, Dispatch<SetStateAction<UserProduct | undefined>>] => {
  const context = useContext(UserProductContext);
  if (!context) {
    throw new Error('useUserProduct must be used within a UserProductProvider');
  }
  return context;
};
