import {proxy} from "valtio";

import {UserProduct} from "../interfaces/UserProduct.ts";

interface UserProductParentMap {
  childToParentMap: Map<string, [string, string]>; // reverse lookup from component to its parent and the mounting point id
}

export const UserProductStore = proxy<UserProduct & UserProductParentMap>({
  base: "1",
  components: {
    "1": {
      componentSpec: "box1",
      mounted: {}
    }
  },
  childToParentMap: new Map<string, [string, string]>()
});
