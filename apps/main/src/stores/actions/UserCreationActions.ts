import { t } from "i18next";
import { v4 as uuid } from "uuid";

import { ProductSpecificationActions } from "./ProductSpecificationActions.ts";
import { ProductSpecificationStore } from "../ProductSpecificationStore.ts";
import { UserCreationStore } from "../UserCreationStore.ts";

export class UserCreationActions {
  static getComponent(componentId: string, store: UserCreationStore) {
    const component = store.components[componentId];
    if (!component) {
      throw new Error(t("errorMissingComponent", { componentId: componentId }));
    }
    return component;
  }

  private static recursiveRemoveComponent(
    componentId: string,
    store: UserCreationStore
  ) {
    const component = this.getComponent(componentId, store);

    Object.values(component.mounted).forEach((componentId) =>
      this.recursiveRemoveComponent(componentId, store)
    );

    delete store.childToParentMap[componentId];
    delete store.components[componentId];
  }

  private static detectComponentCycle(
    sourceComponentId: string,
    targetComponentId: string,
    store: UserCreationStore
  ): boolean {
    if (sourceComponentId === targetComponentId) {
      return true;
    }

    const visited = new Set<string>();
    const queue = [sourceComponentId];

    while (queue.length) {
      const top = queue.shift()!;
      visited.add(top);

      if (top === targetComponentId) {
        return true;
      }

      const currentComponent = store.components[top];
      Object.values(currentComponent.mounted).forEach((neighbor) => {
        if (visited.has(neighbor)) {
          return true;
        }
        queue.push(neighbor);
      });
    }

    return false;
  }

  static createComponent(
    componentSpecId: string,
    userCreationStore: UserCreationStore,
    productSpecificationStore: ProductSpecificationStore
  ): string {
    const newComponentId = uuid();

    const componentSpec = ProductSpecificationActions.getComponentSpec(
      componentSpecId,
      productSpecificationStore
    );

    const materials: Record<string, string> = {};
    Object.keys(componentSpec.materialSpecs).forEach((materialSpecId) => {
      const materialSpec = ProductSpecificationActions.getMaterialSpec(
        componentSpec,
        materialSpecId
      );
      const lowest =
        ProductSpecificationActions.colorSpecificationWithLowestSortIndex(
          materialSpec
        );
      if (lowest) {
        materials[materialSpecId] = lowest;
      }
    });

    userCreationStore.components[newComponentId] = {
      componentSpec: componentSpecId,
      materials: materials,
      mounted: {},
    };

    return newComponentId;
  }

  static unmountComponent(
    componentId: string,
    mountingPointSpecId: string,
    store: UserCreationStore
  ) {
    const component = this.getComponent(componentId, store);
    const mountedComponentId = component.mounted[mountingPointSpecId];

    if (mountedComponentId) {
      delete store.childToParentMap[mountedComponentId];
      delete component.mounted[mountingPointSpecId];
    }
  }

  static removeComponent(componentId: string, store: UserCreationStore) {
    const parentInfo = store.childToParentMap[componentId];
    if (parentInfo) {
      const [parentId, mountingPointSpecId] = parentInfo;
      this.unmountComponent(parentId, mountingPointSpecId, store);
    }

    this.recursiveRemoveComponent(componentId, store);
  }

  static mountComponent(
    targetComponentId: string,
    mountingPointSpecId: string,
    mountComponentId: string,
    userCreationStore: UserCreationStore,
    productSpecificationStore: ProductSpecificationStore
  ) {
    if (
      this.detectComponentCycle(
        targetComponentId,
        mountComponentId,
        userCreationStore
      )
    ) {
      throw new Error(t("errorComponentMountingCycle"));
    }

    const targetComponent = this.getComponent(
      targetComponentId,
      userCreationStore
    );

    ProductSpecificationActions.getMountingPointSpec(
      ProductSpecificationActions.getComponentSpec(
        targetComponent.componentSpec,
        productSpecificationStore
      ),
      mountingPointSpecId
    );

    if (targetComponent.mounted[mountingPointSpecId]) {
      this.removeComponent(
        targetComponent.mounted[mountingPointSpecId],
        userCreationStore
      );
    }

    targetComponent.mounted[mountingPointSpecId] = mountComponentId;
    userCreationStore.childToParentMap[mountComponentId] = [
      targetComponentId,
      mountingPointSpecId,
    ];
  }

  static removeAllNonbaseComponents(store: UserCreationStore) {
    if (store.isBaseSet && store.base) {
      const baseComponent = this.getComponent(store.base, store);
      store.components = {
        [store.base]: { ...baseComponent, mounted: {} },
      };
    } else {
      store.components = {};
    }

    store.childToParentMap = {};
  }

  static setBase(componentId: string, store: UserCreationStore) {
    this.getComponent(componentId, store);
    store.base = componentId;
    store.isBaseSet = true;
    this.removeAllNonbaseComponents(store);
  }

  static changeMaterialColor(
    componentId: string,
    materialSpecId: string,
    colorSpecId: string | undefined,
    userCreationStore: UserCreationStore,
    productSpecificationStore: typeof ProductSpecificationStore
  ) {
    const component = this.getComponent(componentId, userCreationStore);
    const componentSpec = ProductSpecificationActions.getComponentSpec(
      component.componentSpec,
      productSpecificationStore
    );
    const materialSpec = ProductSpecificationActions.getMaterialSpec(
      componentSpec,
      materialSpecId
    );

    if (colorSpecId === undefined) {
      colorSpecId =
        ProductSpecificationActions.colorSpecificationWithLowestSortIndex(
          materialSpec
        );
      if (!colorSpecId) {
        throw Error(
          t("errorNoColorVariationOnMaterial", {
            materialSpecId: materialSpecId,
            componentId: componentId,
          })
        );
      }
    }

    ProductSpecificationActions.getColorSpec(materialSpec, colorSpecId);
    component.materials[materialSpecId] = colorSpecId;
  }

  static detectMissingRequired(
    userCreationStore: UserCreationStore,
    productSpecificationStore: typeof ProductSpecificationStore
  ) {
    return Object.entries(userCreationStore.components).reduce(
      (missingComponents, [componentId, component]) => {
        const componentSpec = ProductSpecificationActions.getComponentSpec(
          component.componentSpec,
          productSpecificationStore
        );

        const isMissing = Object.entries(
          componentSpec.mountingPointsSpecs
        ).some(
          ([mountingPointId, { isRequired }]) =>
            isRequired &&
            !Object.prototype.hasOwnProperty.call(
              component.mounted,
              mountingPointId
            )
        );

        if (isMissing) {
          missingComponents.push(componentId);
        }

        return missingComponents;
      },
      [] as string[]
    );
  }
}
