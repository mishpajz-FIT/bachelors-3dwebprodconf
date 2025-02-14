import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { Popup } from "@3dwebprodconf/shared/src/components/containers/Popup.tsx";
import { Spinner } from "@3dwebprodconf/shared/src/components/Spinner.tsx";
import { useDarkMode } from "@3dwebprodconf/shared/src/hooks/useDarkMode.ts";
import {
  SubmissionOption,
  SubmissionTypeSchema,
} from "@3dwebprodconf/shared/src/schemas/Catalog.ts";
import { UserCreation } from "@3dwebprodconf/shared/src/schemas/UserCreation.ts";
import { successToast } from "@3dwebprodconf/shared/src/toasts/successToast.ts";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";

import { ProductConfirmationContactForm } from "./subcomponents/ProductConfirmationContactForm.tsx";
import { ProductConfirmationTile } from "./subcomponents/ProductConfirmationTile.tsx";
import { globalConfig } from "../../../configurations/Config.ts";
import { CatalogStore } from "../../../stores/CatalogStore.ts";
import { UserCreationStore } from "../../../stores/UserCreationStore.ts";
import { errorToast } from "../../../toasts/errorToast.ts";
import { submitProduct } from "../../../utilities/Requesting.ts";

export const ProductConfirmation = () => {
  const { t } = useTranslation();
  const isDarkmode = useDarkMode();

  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();

  const userCreationSnap = useSnapshot(UserCreationStore);

  const [isContactFormPopupOpen, setContactFormPopupOpen] = useState(false);

  const submissionOption =
    CatalogStore.catalog?.products[UserCreationStore.value.product]?.submission;

  const handleSubmit = async (submission: SubmissionOption) => {
    const userCreation: UserCreation = {
      product: UserCreationStore.value.product,
      base: UserCreationStore.value.base,
      components: UserCreationStore.value.components,
    };

    const redirectUrl = await submitProduct(
      submission,
      JSON.stringify(userCreation)
    );

    successToast(t("submitted"));
    setLoading(false);

    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      navigate("/");
    }
  };

  const onConfirm = () => {
    if (!submissionOption) return;

    switch (submissionOption.type) {
      case SubmissionTypeSchema.Enum.REDIRECT:
        window.location.href = submissionOption.endpointUrl;
        break;
      case SubmissionTypeSchema.Enum.POST:
        setLoading(true);
        handleSubmit(submissionOption).catch(() => {
          errorToast(t("problemDuringSubmission"));
          setLoading(false);
        });
        break;
      case SubmissionTypeSchema.Enum.CONTACT_FORM:
        setContactFormPopupOpen(true);
        break;
      default:
        throw new Error(t("wrongSubmissionType"));
    }
  };

  return (
    <div className="content-background flex min-h-fit shrink grow select-none flex-col items-center justify-start overflow-y-scroll p-4 print:w-screen print:overflow-y-visible print:bg-transparent">
      <div className="content-width no-print">
        <ContainerHeader
          title={t("confirmConfiguration")}
          onClose={undefined}
        />
      </div>

      <div className="flex w-full grow flex-row justify-center">
        <div className="w-full md:w-4/5 lg:w-2/3 xl:w-1/2 print:block print:w-full">
          <ol className="simple-panel mb-20 mt-2 flex w-full flex-col justify-start rounded-xl shadow-none">
            {Object.keys(userCreationSnap.value.components).map(
              (componentId, index) => (
                <li
                  key={componentId}
                  className={`${index !== Object.keys(userCreationSnap.value.components).length - 1 ? "border-b border-b-gray-300 dark:border-b-gray-700" : ""}`}
                >
                  <ProductConfirmationTile componentId={componentId} />
                  <div className="print-page-break" />
                </li>
              )
            )}
          </ol>
        </div>

        <div className="sticky top-12 hidden h-min pl-6 pt-6 lg:flex lg:w-1/4 xl:w-3/12 2xl:w-1/5 print:hidden">
          <div className="no-print simple-panel flex w-full flex-col gap-2 p-4">
            {globalConfig.config.capabilities.savePdfButton && (
              <div className="flex flex-row items-center justify-end gap-1">
                <button className="other-button" onClick={() => window.print()}>
                  {t("saveAsPdf")}
                </button>
              </div>
            )}
            <div className="flex flex-row items-center justify-end gap-1">
              <button
                className="other-button"
                onClick={() =>
                  navigate("/editor/" + userCreationSnap.value.product)
                }
              >
                {t("back")}
              </button>
              {submissionOption && (
                <button className="primary-button" onClick={onConfirm}>
                  {!isLoading ? (
                    t("confirm")
                  ) : (
                    <Spinner
                      dark={
                        (!isDarkmode &&
                          !globalConfig.config.ui.colors.primary
                            .overlayTextWhiteLight) ||
                        (isDarkmode &&
                          !globalConfig.config.ui.colors.primary
                            .overlayTextWhiteDark)
                      }
                    />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="simple-panel no-print absolute inset-x-0 bottom-0 w-full rounded-b-none shadow-2xl lg:hidden">
        <div className="flex flex-row items-center justify-between px-2 py-4">
          <button
            className="other-button"
            onClick={() =>
              navigate("/editor/" + userCreationSnap.value.product)
            }
          >
            Back
          </button>
          <div className="flex flex-row items-center justify-end gap-1">
            {globalConfig.config.capabilities.savePdfButton && (
              <button className="other-button" onClick={() => window.print()}>
                {t("saveAsPdf")}
              </button>
            )}
            {submissionOption && (
              <button className="primary-button" onClick={onConfirm}>
                {!isLoading ? (
                  t("confirm")
                ) : (
                  <Spinner
                    dark={
                      (!isDarkmode &&
                        !globalConfig.config.ui.colors.primary
                          .overlayTextWhiteLight) ||
                      (isDarkmode &&
                        !globalConfig.config.ui.colors.primary
                          .overlayTextWhiteDark)
                    }
                  />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      <Popup
        isOpen={isContactFormPopupOpen}
        onClose={() => setContactFormPopupOpen(false)}
      >
        <ProductConfirmationContactForm
          onClose={() => setContactFormPopupOpen(false)}
        />
      </Popup>
    </div>
  );
};
