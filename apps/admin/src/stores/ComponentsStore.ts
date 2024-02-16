import { ComponentSpecification } from "@3dwebprodconf/shared/src/interfaces/ProductSpecification.ts";
import { proxy } from "valtio";

interface ComponentsStore {
  components: Record<string, ComponentSpecification>;
}

export const ComponentsStore = proxy<ComponentsStore>({
  components: {
    kokos: {
      name: "Kokos",
      description: "Kokosí description.",
      imageUrl: "https://kokos",
      modelUrl: "https://kokos",
      materialSpecs: {},
      mountingPointsSpecs: {},
    },
  },
});
