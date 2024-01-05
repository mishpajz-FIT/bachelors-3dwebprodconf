import {v4 as uuid} from "uuid";

import {ProductOptionsStore} from "../ProductOptionsStore.ts";
import {UserProductStore} from "../UserProductStore.ts";

const recursiveRemoveComponent = (componentId: string) => {
  const component = UserProductStore.components[componentId];

  if (!component) {
    throw new Error(`Attempted to delete component with ID: ${componentId}, which does not exist.`);
  }

  Object.values(component.attachedComponents).forEach(recursiveRemoveComponent);

  UserProductStore.childToParentMap.delete(componentId);
  delete UserProductStore.components[componentId];
};

const detectRecursiveComponentCycle = (sourceComponentId: string, targetComponentId: string): boolean => {
  if (sourceComponentId == targetComponentId) {
    return true;
  }

  const visited = new Set<string>(targetComponentId);
  const queue: string[] = [targetComponentId];

  while (queue.length > 0) {
    const top = queue.shift();

    if (!top) {
      throw new Error(`Component tree failure, component with ID: ${top} does not exist.`);
    }

    if (top == sourceComponentId) {
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

export const createNewComponent = (componentProductId: string): string => {
  const newComponentId = uuid();

  UserProductStore.components[newComponentId] = {
    componentProductId: componentProductId,
    configuredMaterials: {},
    attachedComponents: {}
  };

  return newComponentId;
};

export const mountComponent = (targetComponentId: string, mountingPointId: string, mountComponentId: string) => {
  // TODO: add checks for: non exising target, non exising new component, creation of recursive cycle
  const targetComponent = UserProductStore.components[targetComponentId];
  if (!targetComponent) {
    throw new Error(`Target component with ID ${targetComponentId} does not exist.`);
  }

  const mountComponent = UserProductStore.components[mountComponentId];
  if (!mountComponent) {
    throw new Error(`Mount component with ID ${targetComponentId} does not exist.`);
  }

  if (detectRecursiveComponentCycle(targetComponentId, mountComponentId)) {
    throw new Error(`Component tree failure, component mounting cycle detected.`);
  }

  if (ProductOptionsStore.isLoading) {
    throw new Error(`Loading Product Options.`);
  }

  const targetComponentOptions = ProductOptionsStore.components.get(targetComponent.componentProductId);
  if (!targetComponentOptions) {
    throw new Error(`Options for component ${targetComponent.componentProductId} do not exist.`);
  }

  const mountingPointExists = targetComponentOptions.mountingPoints.some(mp => mp.mountingPointId === mountingPointId);
  if (!mountingPointExists) {
    throw new Error(`Mounting point ${mountingPointId} on ${targetComponent.componentProductId} do not exist.`);
  }

  const alreadyExistingComponentId = targetComponent.attachedComponents[mountingPointId];
  if (alreadyExistingComponentId) {
    recursiveRemoveComponent(alreadyExistingComponentId);
  }

  targetComponent.attachedComponents[mountingPointId] = mountComponentId;
  UserProductStore.childToParentMap.set(mountComponentId, [targetComponentId, mountingPointId]);
};

export const removeComponent = (componentId: string) => {

  const parentInfo = UserProductStore.childToParentMap.get(componentId);
  if (parentInfo) {
    const [parentId, mountingPointId] = parentInfo;

    const parent = UserProductStore.components[parentId];
    delete parent.attachedComponents[mountingPointId];
  }

  recursiveRemoveComponent(componentId);

  UserProductStore.childToParentMap.delete(componentId);

  console.log(`remove ${componentId}`);
};
