import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { ContactInfo } from "@3dwebprodconf/shared/src/interfaces/SubmissionResponse.ts";
import { FormEvent } from "react";

import { submitProduct } from "../../../../stores/actions/CatalogueActions.ts";
import { CatalogueStore } from "../../../../stores/CatalogueStore.ts";
import { ConfiguratorValuesStore } from "../../../../stores/ConfiguratorValuesStore.ts";
import { UserCreationStore } from "../../../../stores/UserCreationStore.ts";

interface ProductConfirmationContactFormProps {
  onClose: () => void;
}

export const ProductConfirmationContactForm = ({
  onClose,
}: ProductConfirmationContactFormProps) => {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!ConfiguratorValuesStore.currentProductId) {
      return;
    }

    const submission =
      CatalogueStore.catalogue?.products[
        ConfiguratorValuesStore.currentProductId
      ].submission;
    if (!submission) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const contactInfo: ContactInfo = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    };

    const phone = formData.get("phone");
    const note = formData.get("note");

    if (phone) contactInfo.phone = phone as string;
    if (note) contactInfo.note = note as string;

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
    }
  };

  return (
    <div className="flex min-w-96 flex-col">
      <ContainerHeader title={"Inquiry"} onClose={onClose} subheader={true} />
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit}>
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
