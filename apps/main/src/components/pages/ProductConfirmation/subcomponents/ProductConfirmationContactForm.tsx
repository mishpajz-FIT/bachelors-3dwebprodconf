import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { Spinner } from "@3dwebprodconf/shared/src/components/Spinner.tsx";
import { useDarkMode } from "@3dwebprodconf/shared/src/hooks/useDarkMode.ts";
import { SubmissionOption } from "@3dwebprodconf/shared/src/schemas/Catalog.ts";
import { ContactInfo } from "@3dwebprodconf/shared/src/schemas/network/ContactInfo.ts";
import { successToast } from "@3dwebprodconf/shared/src/toasts/successToast.ts";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { globalConfig } from "../../../../configurations/Config.ts";
import { CatalogStore } from "../../../../stores/CatalogStore.ts";
import { UserCreationStore } from "../../../../stores/UserCreationStore.ts";
import { errorToast } from "../../../../toasts/errorToast.ts";
import { submitProduct } from "../../../../utilities/Requesting.ts";

interface ProductConfirmationContactFormProps {
  onClose: () => void;
}

export const ProductConfirmationContactForm = ({
  onClose,
}: ProductConfirmationContactFormProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isDarkmode = useDarkMode();

  const submissionOption =
    CatalogStore.catalog?.products[UserCreationStore.value.product]?.submission;

  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (
    submission: SubmissionOption,
    contactInfo: ContactInfo
  ) => {
    const userCreationWithContact = {
      product: UserCreationStore.value.product,
      base: UserCreationStore.value.base,
      components: UserCreationStore.value.components,
      contact: contactInfo,
    };

    const redirectUrl = await submitProduct(
      submission,
      JSON.stringify(userCreationWithContact)
    );

    successToast(t("submittedContactForm"));
    setLoading(false);

    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      navigate("/");
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!submissionOption) return;

    if (isLoading) return;

    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const contactInfo: ContactInfo = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    };

    const phone = formData.get("phone");
    const note = formData.get("note");

    if (phone) contactInfo.phone = phone as string;
    if (note) contactInfo.note = note as string;

    handleSubmit(submissionOption, contactInfo).catch(() => {
      errorToast(t("problemDuringContactFormSubmission"));
      setLoading(false);
    });
  };

  return (
    <div className="flex min-w-96 flex-col">
      <ContainerHeader
        title={t("inquiry")}
        onClose={onClose}
        subheader={true}
      />
      <form onSubmit={onSubmit}>
        <div className="m-4 grid grid-cols-1 gap-4">
          <label>
            <span className="label">{t("name")}</span>
            <input
              type="text"
              id="name"
              name="name"
              className="field"
              placeholder="Your Name"
              required={true}
            />
          </label>
          <label>
            <span className="label">{t("email")}</span>
            <input
              type="email"
              id="email"
              name="email"
              className="field"
              placeholder="your@email.com"
              required={true}
            />
          </label>
          <label>
            <span className="label">{t("phoneNumber")}</span>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="field"
              placeholder="+00"
              maxLength={20}
            />
          </label>
          <label>
            <span className="label">{t("note")}</span>
            <textarea
              name="note"
              className="field"
              placeholder="Note"
              maxLength={10000}
            />
          </label>
          <button type="submit" className="primary-button" tabIndex={0}>
            {!isLoading ? (
              t("confirm")
            ) : (
              <Spinner
                dark={
                  (!isDarkmode &&
                    !globalConfig.config.ui.colors.primary
                      .overlayTextWhiteLight) ||
                  (isDarkmode &&
                    !globalConfig.config.ui.colors.primary.overlayTextWhiteDark)
                }
              />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
