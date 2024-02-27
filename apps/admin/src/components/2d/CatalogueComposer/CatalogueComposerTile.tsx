import { ImageURLInput } from "@3dwebprodconf/shared/src/components/inputs/ImageURLInput.tsx";
import { TextInput } from "@3dwebprodconf/shared/src/components/inputs/TextInput.tsx";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useSnapshot } from "valtio";

import { CatalogueStore } from "../../../stores/CatalogueStore.ts";

interface CatalogueComposerTileProps {
  productId: string;
}

export const CatalogueComposerTile = ({
  productId,
}: CatalogueComposerTileProps) => {
  const catalogueSnap = useSnapshot(CatalogueStore);

  const product = catalogueSnap.products[productId];
  if (!product) {
    throw new Error(`Product ${productId} does not exist.`);
  }

  return (
    <div className="tile-background w-full rounded-lg border-2 border-transparent">
      <div>
        <div className="flex flex-col items-center justify-start gap-2 p-2 slashed-zero tabular-nums tracking-tight text-black dark:text-gray-200">
          <span className="w-full shrink-0 truncate font-mono text-lg font-semibold tracking-tight text-gray-700 dark:text-gray-300">
            {productId}
          </span>
          <div className="flex w-full flex-row gap-4 p-4">
            <label htmlFor={"name"} className="w-full">
              <span className="label">Name</span>
              <TextInput
                key={"name"}
                inputId={"name"}
                allowEmpty={false}
                placeholder={"Car"}
                currentValue={product.name}
                submitValue={(value: string) => {
                  const editableProduct = CatalogueStore.products[productId];

                  editableProduct.name = value;
                }}
              />
            </label>
            <div className="flex w-full flex-col gap-2">
              <label htmlFor={"imageUrl"}>
                <span className="label">Preview image</span>
                <ImageURLInput
                  key={"imageUrl"}
                  inputId={"imageUrl"}
                  allowEmpty={false}
                  placeholder={"https://cdn.url/my-product-image.jpg"}
                  currentValue={product.imageUrl}
                  submitValue={(value: string) => {
                    const editableProduct = CatalogueStore.products[productId];

                    editableProduct.imageUrl = value;
                  }}
                />
              </label>
              <label htmlFor={"specificationUrl"}>
                <span className="label">Product specification</span>
                <TextInput
                  key={"specificationUrl"}
                  inputId={"specificationUrl"}
                  allowEmpty={false}
                  placeholder={"/productspecification.json"}
                  currentValue={product.productSpecificationUrl}
                  submitValue={(value: string) => {
                    const editableProduct = CatalogueStore.products[productId];

                    editableProduct.productSpecificationUrl = value;
                  }}
                />
              </label>
            </div>
          </div>

          <div className="flex w-full flex-row items-center justify-end">
            <button
              className="other-button p-1"
              onClick={() => {
                delete CatalogueStore.products[productId];
              }}
            >
              <TrashIcon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
