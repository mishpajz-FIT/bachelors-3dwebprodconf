import { TextInput } from "@3dwebprodconf/shared/src/components/inputs/TextInput.tsx";
import {
  SubmissionType,
  SubmissionTypeSchema,
} from "@3dwebprodconf/shared/src/schemas/Catalogue.ts";

import { useProduct } from "../../../../hooks/useProduct.ts";
import { CatalogueActions } from "../../../../stores/actions/CatalogueActions.ts";
import { CatalogueStore } from "../../../../stores/CatalogueStore.ts";

interface CatalogueComposerTileSubmissionProps {
  productId: string;
}

export const CatalogueComposerTileSubmission = ({
  productId,
}: CatalogueComposerTileSubmissionProps) => {
  const product = useProduct(productId);

  const noneType = "NONE";

  return (
    <div className="flex w-full flex-row gap-4 p-4">
      <label htmlFor={"specificationUrl"}>
        <span className="label">Product specification</span>
        <select
          id="endpointType"
          value={product.submission ? product.submission.type : noneType}
          onChange={(e) => {
            const editableProduct = CatalogueActions.getProduct(
              productId,
              CatalogueStore
            );
            if (e.target.value === noneType) {
              delete editableProduct.submission;
            } else {
              if (!editableProduct.submission) {
                editableProduct.submission = {
                  endpointUrl: "",
                  type: SubmissionTypeSchema.Enum.POST,
                };
              }
              editableProduct.submission.type = e.target
                .value as SubmissionType;
            }
          }}
        >
          <option key={noneType} value={noneType}>
            Preview only
          </option>
          <option
            key={SubmissionTypeSchema.Enum.POST}
            value={SubmissionTypeSchema.Enum.POST}
          >
            POST request
          </option>
          <option
            key={SubmissionTypeSchema.Enum.CONTACT_FORM}
            value={SubmissionTypeSchema.Enum.CONTACT_FORM}
          >
            Contact form
          </option>
        </select>
      </label>
      {product.submission && (
        <label htmlFor={"endpoint"} className="w-full">
          <span className="label">Endpoint url</span>
          <TextInput
            key={"endpoint"}
            inputId={"endpoint"}
            allowEmpty={false}
            placeholder={"https://eshop.com/api/order/submit"}
            currentValue={product.submission.endpointUrl}
            submitValue={(value: string) => {
              const editableSubmission = CatalogueActions.getProduct(
                productId,
                CatalogueStore
              ).submission;
              if (!editableSubmission) {
                return;
              }

              editableSubmission.endpointUrl = value;
            }}
          />
        </label>
      )}
    </div>
  );
};
