import {v4 as uuid} from "uuid";

import {ProductSpecificationStore} from "../ProductSpecificationStore.ts";
import {UserProductStore} from "../UserProductStore.ts";

const recursiveRemoveComponent = (componentId: string) => {
  const component = UserProductStore.components[componentId];

  if (!component) {
    throw new Error(`Attempted to delete component with ID: ${componentId}, which does not exist.`);
  }

  Object.values(component.mounted).forEach(recursiveRemoveComponent);

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
    for (const neighbor of Object.values(currentComponent.mounted)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return false;
};

export const createNewComponent = (componentSpec: string): string => {
  const newComponentId = uuid();

  UserProductStore.components[newComponentId] = {
    componentSpec: componentSpec,
    materials: {},
    mounted: {}
  };

  return newComponentId;
};

export const mountComponent = (targetComponentId: string, mountingPointSpecId: string, mountComponentId: string) => {
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

  if (ProductSpecificationStore.isLoading) {
    throw new Error(`Loading Product Options.`);
  }

  const targetComponentSpecs = ProductSpecificationStore.componentSpecs[targetComponent.componentSpec];
  if (!targetComponentSpecs) {
    throw new Error(`Specification ${targetComponent.componentSpec} component do not exist.`);
  }

  const mountingPoint = targetComponentSpecs.mountingPointsSpecs[mountingPointSpecId];
  if (!mountingPoint) {
    throw new Error(`Mounting point ${mountingPointSpecId} on ${targetComponent.componentSpec} does not exist.`);
  }

  const alreadyExistingComponentId = targetComponent.mounted[mountingPointSpecId];
  if (alreadyExistingComponentId) {
    recursiveRemoveComponent(alreadyExistingComponentId);
  }

  targetComponent.mounted[mountingPointSpecId] = mountComponentId;
  UserProductStore.childToParentMap.set(mountComponentId, [targetComponentId, mountingPointSpecId]);
};

export const removeComponent = (componentId: string) => {

  const parentInfo = UserProductStore.childToParentMap.get(componentId);
  if (parentInfo) {
    const [parentId, mountingPointSpecId] = parentInfo;

    const parent = UserProductStore.components[parentId];
    delete parent.mounted[mountingPointSpecId];
  }

  recursiveRemoveComponent(componentId);

  UserProductStore.childToParentMap.delete(componentId);

  console.log(`remove ${componentId}`);
};
