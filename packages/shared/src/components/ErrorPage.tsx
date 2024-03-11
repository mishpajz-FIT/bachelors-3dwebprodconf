import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export const ErrorPage = () => {
  const error = useRouteError();

  console.error(error);

  const errorText = isRouteErrorResponse(error)
    ? error.statusText
    : "An unexpected error has occurred.";

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="p-4 text-center">
        <h1 className="mb-4 text-4xl font-bold">Oops!</h1>
        <p className="mb-8 text-xl">{errorText}</p>
        <button
          onClick={() => (window.location.href = "/")}
          className="other-button mt-4"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
