import { ProductSpecification } from "@3dwebprodconf/shared/src/interfaces/ProductSpecification.ts";
import { proxy } from "valtio";

export const ProductStore = proxy<ProductSpecification>({
  componentSpecs: {
    kokos: {
      name: "Kokos",
      description: "Kokosí description.",
      imageUrl: "https://kokos",
      modelUrl: "https://kokos",
      materialSpecs: {},
      mountingPointsSpecs: {},
    },
  },
  baseSpecs: {},
});
