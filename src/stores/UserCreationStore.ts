import { proxy } from "valtio";

import { UserCreation } from "../interfaces/UserCreation.ts";

interface UserProductAdditionalInfo {
  childToParentMap: Map<string, [string, string]>; // reverse lookup from component to its parent and the mounting point id
  isBaseSet: boolean;
}

export const UserCreationStore = proxy<
  UserCreation & UserProductAdditionalInfo
>({
  base: "",
  components: {},
  childToParentMap: new Map<string, [string, string]>(),
  isBaseSet: false,
});
