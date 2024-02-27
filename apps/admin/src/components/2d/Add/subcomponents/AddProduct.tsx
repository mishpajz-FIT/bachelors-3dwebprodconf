import { FormEvent, useState } from "react";

import { CatalogueStore } from "../../../../stores/CatalogueStore.ts";
import { refreshBounds } from "../../../../utilities/BoundsManipulation.ts";
import { AddContent } from "../AddContent.tsx";

interface AddProductProps {
  onClose: () => void;
}

export const AddProduct = ({ onClose }: AddProductProps) => {
  const [isShowingError, setShowingError] = useState(false);

  const addNewProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowingError(false);

    const data = new FormData(event.currentTarget);

    if (
      Object.prototype.hasOwnProperty.call(
        CatalogueStore.products,
        data.get("id") as string
      )
    ) {
      setShowingError(true);
      return;
    }

    CatalogueStore.products[data.get("id") as string] = {
      name: data.get("name") as string,
      imageUrl: data.get("imageUrl") as string,
      productSpecificationUrl: data.get("specificationUrl") as string,
    };
    setShowingError(false);
    onClose();
    refreshBounds();
  };

  const renderTextInput = (
    displayName: string,
    type: string,
    placeholder: string
  ) => (
    <label>
      <span className="label">{displayName}</span>
      <input
        type="text"
        name={type}
        className="field"
        placeholder={placeholder}
        required={true}
      />
    </label>
  );

  return (
    <AddContent
      heading={"Add new product"}
      onClose={onClose}
      showingError={isShowingError}
      errorReason={"Product with this ID already exists."}
    >
      <form onSubmit={addNewProduct}>
        <div className="m-4 grid grid-cols-1 gap-4">
          {renderTextInput("ID", "id", "product-1")}
          {renderTextInput("Name", "name", "Car")}
          {renderTextInput(
            "Preview image",
            "imageUrl",
            "https://cdn.url/my-product-image.jpg"
          )}
          {renderTextInput(
            "Product specification",
            "specificationUrl",
            "/productspecification.json"
          )}
          <button type="submit" className="primary-button" tabIndex={0}>
            Add
          </button>
        </div>
      </form>
    </AddContent>
  );
};
