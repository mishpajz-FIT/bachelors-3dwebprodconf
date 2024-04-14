import { ErrorPage } from "@3dwebprodconf/shared/src/components/ErrorPage.tsx";
import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";

import { CatalogComposer } from "./components/pages/CatalogComposer/CatalogComposer.tsx";
import { TopBar } from "./TopBar.tsx";

const ProductComposer = lazy(
  () => import("./components/pages/ProductComposer/ProductComposer.tsx")
);

const ErrorElement = () => (
  <TopBar>
    <ErrorPage />
  </TopBar>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <></>,
    errorElement: <ErrorElement />,
    loader: () => {
      return redirect("/productcomposer");
    },
  },
  {
    path: "/catalogcomposer",
    element: (
      <TopBar>
        <CatalogComposer />
      </TopBar>
    ),
    errorElement: <ErrorElement />,
  },
  {
    path: "/productcomposer",
    element: (
      <TopBar>
        <Suspense fallback={<div className="content-background size-full" />}>
          <ProductComposer />
        </Suspense>
      </TopBar>
    ),
    errorElement: <ErrorElement />,
  },
]);

export const AppContent = () => {
  return (
    <>
      <div className="app hidden h-dvh flex-col lg:flex">
        <Toaster position="top-right" reverseOrder={true} />
        <RouterProvider router={router} />
      </div>
      <div className="flex h-screen flex-row items-center justify-center p-4 text-center lg:hidden">
        <p className="text-lg">
          Sorry, this application requires a larger screen to function
          correctly.
        </p>
      </div>
    </>
  );
};
