import {v4 as uuid} from 'uuid';
import {proxy} from "valtio";

import {ProductOptionsStore} from "./ProductOptionsStore.ts";
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


const recursiveRemoveComponent = (componentId: string) => {
  const component = UserProductStore.components[componentId];

  if (!component) {
    throw new Error(`Attempted to delete component with ID: ${componentId}, which does not exist.`);
  }

  Object.values(component.attachedComponents).forEach(recursiveRemoveComponent);

  delete UserProductStore.components[componentId];
};

const detectRecursiveComponentCycle = (targetComponentId: string, newComponentId: string): boolean => {
  if (targetComponentId == newComponentId) {
    return true;
  }

  const visited = new Set<string>(newComponentId);
  const queue: string[] = [newComponentId];

  while (queue.length > 0) {
    const top = queue.shift();

    if (!top) {
      throw new Error(`Component tree failure, component with ID: ${top} does not exist.`);
    }

    if (top == targetComponentId) {
      return true;
    }

    const currentComponent = UserProductStore.components[top];
    for (const neighbor of Object.values(currentComponent.attachedComponents)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return false;
};

export const attachComponentInStore = (targetComponentId: string, mountingPointId: string, newComponentId: string) => {
  // TODO: add checks for: non exising target, non exising new component, creation of recursive cycle
  const targetComponent = UserProductStore.components[targetComponentId];
  if (!targetComponent) {
    throw new Error(`Target component with ID: ${targetComponentId} does not exist.`);
  }

  const newComponent = UserProductStore.components[newComponentId];
  if (!newComponent) {
    throw new Error(`Component with ID: ${targetComponentId} does not exist.`);
  }

  if (detectRecursiveComponentCycle(targetComponentId, newComponentId)) {
    throw new Error(`Component tree failure, component mounting cycle detected.`);
  }

  if (!ProductOptionsStore.productOptions) {
    throw new Error(`Missing Product Options.`);
  }

  const mountingPointExists = ProductOptionsStore.productOptions.components.some(comp =>
    comp.id === targetComponent.component && comp.mountingPoints.some(mp => mp.id === mountingPointId)
  );
  if (!mountingPointExists) {
    throw new Error(`Mounting point with ID: ${targetComponentId} does not exist.`);
  }

  const existingComponentId = targetComponent.attachedComponents[mountingPointId];
  if (existingComponentId) {
    recursiveRemoveComponent(existingComponentId);
  }

  targetComponent.attachedComponents[mountingPointId] = newComponentId;
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
