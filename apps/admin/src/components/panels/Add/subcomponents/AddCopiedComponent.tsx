import { ComponentSpecification } from "@3dwebprodconf/shared/src/schemas/ProductSpecification.ts";
import { FormEvent, useState } from "react";

import { useSelectedComponentSpec } from "../../../../hooks/useSelectedComponentSpec.ts";
import { ProductActions } from "../../../../stores/actions/ProductActions.ts";
import { ProductStore } from "../../../../stores/ProductStore.ts";
import { refreshBounds } from "../../../../utilities/BoundsManipulation.ts";
import { AddContent } from "../AddContent.tsx";

interface AddCopiedComponentSpecificationProps {
  onClose: () => void;
}

export const AddCopiedComponentSpecification = ({
  onClose,
}: AddCopiedComponentSpecificationProps) => {
  const [isShowingError, setShowingError] = useState(false);

  const { componentSpecId } = useSelectedComponentSpec();

  const copyComponent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowingError(false);

    const data = new FormData(event.currentTarget);
    const id = data.get("id") as string;

    if (ProductActions.componentSpecExists(id, ProductStore)) {
      setShowingError(true);
      return;
    }

    const copiedComponent = JSON.parse(
      JSON.stringify(ProductStore.componentSpecs[componentSpecId])
    ) as ComponentSpecification;

    ProductActions.addComponentSpec(id, copiedComponent, ProductStore);

    onClose();
    refreshBounds();
  };

  const renderTextInput = (
    displayName: string,
    type: string,
    placeholder: string
  ) => (
    <label>
      <span className="label-aligned">{displayName}</span>
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
      heading={"Copy component"}
      onClose={onClose}
      showingError={isShowingError}
      errorReason={"Component with this ID already exists."}
    >
      <form onSubmit={copyComponent}>
        <div className="m-4 grid grid-cols-1 gap-4">
          {renderTextInput("ID", "id", "component-2")}
          <button type="submit" className="primary-button" tabIndex={0}>
            Copy
          </button>
        </div>
      </form>
    </AddContent>
  );
};
