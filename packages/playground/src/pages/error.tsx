import { useRouteError } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";

export function ErrorPage() {
  // const error = useRouteError();
  // console.error('router error>>>', error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
    </div>
  );
}