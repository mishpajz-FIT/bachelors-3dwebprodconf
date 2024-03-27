import { useTranslation } from "react-i18next";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export const ErrorPage = () => {
  const { t } = useTranslation();

  const error = useRouteError();

  console.error(error);

  const errorText = isRouteErrorResponse(error)
    ? error.statusText
    : t("unexpectedError");

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="p-4 text-center">
        <h1 className="mb-4 text-4xl font-bold">{t("oops")}</h1>
        <p className="mb-8 text-xl">{errorText}</p>
        <button
          onClick={() => (window.location.href = "/")}
          className="other-button mt-4"
        >
          {t("reset")}
        </button>
      </div>
    </div>
  );
};
