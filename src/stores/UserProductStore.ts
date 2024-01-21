import { proxy } from "valtio";

import { UserProduct } from "../interfaces/UserProduct.ts";

interface UserProductAdditionalInfo {
  childToParentMap: Map<string, [string, string]>; // reverse lookup from component to its parent and the mounting point id
  isBaseSet: boolean;
}

export const UserProductStore = proxy<UserProduct & UserProductAdditionalInfo>({
  base: "",
  components: {},
  childToParentMap: new Map<string, [string, string]>(),
  isBaseSet: false,
});
