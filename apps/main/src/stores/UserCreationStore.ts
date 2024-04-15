import { UserCreation } from "@3dwebprodconf/shared/src/schemas/UserCreation.ts";
import { proxyWithHistory } from "valtio-history";

interface UserCreationAdditionalInfo {
  childToParentMap: Record<string, [string, string]>; // reverse lookup from component to its parent and the mounting point id
  isBaseSet: boolean;
}

export const UserCreationStore = proxyWithHistory<
  UserCreation & UserCreationAdditionalInfo
>({
  product: "",
  base: "",
  components: {},
  childToParentMap: {},
  isBaseSet: false,
});
