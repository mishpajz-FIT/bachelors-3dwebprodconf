import { UserCreation } from "@3dwebprodconf/shared/src/schemas/UserCreation.ts";
import { proxy } from "valtio";

interface UserCreationAdditionalInfo {
  childToParentMap: Map<string, [string, string]>; // reverse lookup from component to its parent and the mounting point id
  isBaseSet: boolean;
}

export const UserCreationStore = proxy<
  UserCreation & UserCreationAdditionalInfo
>({
  base: "",
  components: {},
  childToParentMap: new Map<string, [string, string]>(),
  isBaseSet: false,
});
