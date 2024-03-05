import { UserComponent } from "@3dwebprodconf/shared/src/interfaces/UserCreation.ts";
import { v4 as uuid } from "uuid";

import {
  validateColorSpec,
  validateComponentSpec,
  validateMaterialSpec,
  validateMountingPointSpec,
} from "./ProductSpecificationActions.ts";
import { ProductSpecificationStore } from "../ProductSpecificationStore.ts";
import { UserCreationStore } from "../UserCreationStore.ts";

export const validateComponent = (
  componentId: string,
  store: typeof UserCreationStore
) => {
  const component = store.components[componentId];
  if (!component) {
    throw new Error(`Component with ID ${componentId} does not exist.`);
  }
  return component;
};

const recursiveRemoveComponent = (
  componentId: string,
  store: typeof UserCreationStore
) => {
  const component = validateComponent(componentId, store);

  Object.values(component.mounted).forEach((componentId) =>
    recursiveRemoveComponent(componentId, store)
  );

  store.childToParentMap.delete(componentId);
  delete store.components[componentId];
};

const detectComponentCycle = (
  sourceComponentId: string,
  targetComponentId: string,
  store: typeof UserCreationStore
): boolean => {
  if (sourceComponentId == targetComponentId) {
    return true;
  }

  const visited = new Set<string>(targetComponentId);
  const queue: string[] = [targetComponentId];

  while (queue.length > 0) {
    const top = queue.shift();

    if (!top) {
      throw new Error(
        `Component tree failure, component with ID: ${top} does not exist.`
      );
    }

    if (top == sourceComponentId) {
      return true;
    }

    const currentComponent = store.components[top];
    for (const neighbor of Object.values(currentComponent.mounted)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return false;
};

export const createComponent = (
  componentSpec: string,
  userCreationStore: typeof UserCreationStore,
  productSpecificationStore: typeof ProductSpecificationStore
): string => {
  const newComponentId = uuid();

  if (!productSpecificationStore.componentSpecs[componentSpec]) {
    throw Error(`Component spec ${componentSpec} does not exist!`);
  }

  userCreationStore.components[newComponentId] = {
    componentSpec: componentSpec,
    materials: {},
    mounted: {},
  };

  return newComponentId;
};

export const mountComponent = (
  targetComponentId: string,
  mountingPointSpecId: string,
  mountComponentId: string,
  userCreationStore: typeof UserCreationStore,
  productSpecificationStore: typeof ProductSpecificationStore
) => {
  const targetComponent = validateComponent(
    targetComponentId,
    userCreationStore
  );
  validateComponent(mountComponentId, userCreationStore);

  validateMountingPointSpec(
    targetComponent.componentSpec,
    mountingPointSpecId,
    productSpecificationStore
  );

  if (
    detectComponentCycle(targetComponentId, mountComponentId, userCreationStore)
  ) {
    throw new Error(
      `Component tree failure, component mounting cycle detected.`
    );
  }

  if (targetComponent.mounted[mountingPointSpecId]) {
    recursiveRemoveComponent(
      targetComponent.mounted[mountingPointSpecId],
      userCreationStore
    );
  }

  targetComponent.mounted[mountingPointSpecId] = mountComponentId;
  userCreationStore.childToParentMap.set(mountComponentId, [
    targetComponentId,
    mountingPointSpecId,
  ]);
};

export const unmountComponent = (
  componentId: string,
  mountingPointSpecId: string,
  userProductStore: typeof UserCreationStore
) => {
  const component = validateComponent(componentId, userProductStore);

  const mountedComponentId = component.mounted[mountingPointSpecId];
  if (mountedComponentId) {
    userProductStore.childToParentMap.delete(mountedComponentId);
    delete component.mounted[mountingPointSpecId];
  }
};

export const removeComponent = (
  componentId: string,
  store: typeof UserCreationStore
) => {
  const parentInfo = store.childToParentMap.get(componentId);
  if (parentInfo) {
    const [parentId, mountingPointSpecId] = parentInfo;
    unmountComponent(parentId, mountingPointSpecId, store);
  }

  recursiveRemoveComponent(componentId, store);
};

export const removeNonbaseComponents = (store: typeof UserCreationStore) => {
  const base = store.base;

  const newComponents: Record<string, UserComponent> = {};
  if (store.components[base]) {
    newComponents[base] = store.components[base];
    newComponents[base].mounted = {};
  }

  store.childToParentMap.clear();
  store.components = newComponents;
};

export const mountBase = (
  componentId: string,
  store: typeof UserCreationStore
) => {
  store.base = componentId;
  store.isBaseSet = true;
  removeNonbaseComponents(store);
};

export const changeMaterial = (
  componentId: string,
  materialSpecId: string,
  colorSpecId: string | undefined,
  userCreationStore: typeof UserCreationStore,
  productSpecificationStore: typeof ProductSpecificationStore
) => {
  const component = validateComponent(componentId, userCreationStore);
  validateMaterialSpec(
    component.componentSpec,
    materialSpecId,
    productSpecificationStore
  );

  if (colorSpecId === undefined) {
    delete userCreationStore.components[componentId].materials[materialSpecId];
    return;
  }

  validateColorSpec(
    component.componentSpec,
    materialSpecId,
    colorSpecId,
    productSpecificationStore
  );
  userCreationStore.components[componentId].materials[materialSpecId] =
    colorSpecId;
};

export const detectRequiredMissing = (
  userCreationStore: typeof UserCreationStore,
  productSpecificationStore: typeof ProductSpecificationStore
): string[] => {
  const missingComponents: string[] = [];

  Object.entries(userCreationStore.components).forEach(
    ([componentId, component]) => {
      const componentSpec = validateComponentSpec(
        component.componentSpec,
        productSpecificationStore
      );

      Object.entries(componentSpec.mountingPointsSpecs).forEach(
        ([mountingPointId, mountingPoint]) => {
          if (
            mountingPoint.isRequired &&
            !Object.prototype.hasOwnProperty.call(
              component.mounted,
              mountingPointId
            )
          ) {
            missingComponents.push(componentId);
          }
        }
      );
    }
  );

  return missingComponents;
};
