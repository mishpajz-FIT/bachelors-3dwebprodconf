import {v4 as uuid} from 'uuid';
import {proxy} from "valtio";

import {UserProduct} from "../interfaces/UserProduct.ts";

export const createNewComponentInStore = (component: string): string => {
  const newComponentId = uuid();

  UserProductStore.components[newComponentId] = {
    component: component,
    configuredMaterials: {},
    attachedComponents: {}
  };

  return newComponentId;
};

export const attachComponentInStore = (targetComponentId: string, mountingPointId: string, newComponentId: string) => {
  // TODO: add checks for: non exising target, non exising new component, creation of recursive cycle
  const targetComponent = UserProductStore.components[targetComponentId];
  if (targetComponent) {
    targetComponent.attachedComponents[mountingPointId] = newComponentId;
  }
};

export const UserProductStore = proxy<UserProduct>({
  baseComponentId: "1",
  components: {
    "1": {
      component: "comp1",
      configuredMaterials: {},
      attachedComponents: {}
    }
  }
});
