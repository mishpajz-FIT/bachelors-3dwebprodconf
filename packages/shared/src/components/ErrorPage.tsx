import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export const ErrorPage = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Error!</h1>
        <h2>{error.status}</h2>
        <p>{error.statusText}</p>
      </div>
    );
  } else {
    return <div>Oops</div>;
  }
};
