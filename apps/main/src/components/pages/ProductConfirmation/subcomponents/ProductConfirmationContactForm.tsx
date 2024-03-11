import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { SubmissionOption } from "@3dwebprodconf/shared/src/schemas/Catalogue.ts";
import { ContactInfo } from "@3dwebprodconf/shared/src/schemas/network/ContactInfo.ts";
import { successToast } from "@3dwebprodconf/shared/src/toasts/successToast.ts";
import { FormEvent, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { CatalogueStore } from "../../../../stores/CatalogueStore.ts";
import { ConfiguratorValuesStore } from "../../../../stores/ConfiguratorValuesStore.ts";
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

  const submissionOption = useMemo(
    () =>
      ConfiguratorValuesStore.currentProductId &&
      CatalogueStore.catalogue?.products[
        ConfiguratorValuesStore.currentProductId
      ]?.submission,
    []
  );

  const handleSubmit = async (
    submission: SubmissionOption,
    contactInfo: ContactInfo
  ) => {
    const userCreationWithContact = {
      base: UserCreationStore.base,
      components: UserCreationStore.components,
      contact: contactInfo,
    };

    const redirectUrl = await submitProduct(
      submission,
      JSON.stringify(userCreationWithContact)
    );

    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      navigate("/");
    }

    successToast("Sent.");
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!submissionOption) return;

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
      errorToast("Unknown error has occurred when sending contact info..");
    });
  };

  return (
    <div className="flex min-w-96 flex-col">
      <ContainerHeader title={"Inquiry"} onClose={onClose} subheader={true} />
      <form onSubmit={onSubmit}>
        <div className="m-4 grid grid-cols-1 gap-4">
          <label>
            <span className="label">Name</span>
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
            <span className="label">Email</span>
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
            <span className="label">Phone number</span>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="field"
              placeholder="+00"
            />
          </label>
          <label>
            <span className="label">Note</span>
            <textarea name="note" className="field" placeholder="Note" />
          </label>
          <button type="submit" className="primary-button" tabIndex={0}>
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
};
