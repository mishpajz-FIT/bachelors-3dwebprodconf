import { ErrorPage } from "@3dwebprodconf/shared/src/components/ErrorPage.tsx";
import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";

import { CatalogueComposer } from "./components/2d/CatalogueComposer/CatalogueComposer.tsx";
import { TopBar } from "./TopBar.tsx";

export const AppContent = () => {
  const ProductComposer = lazy(
    () => import("./components/2d/ProductComposer/ProductComposer.tsx")
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <></>,
      errorElement: (
        <TopBar>
          <ErrorPage />
        </TopBar>
      ),
      loader: () => {
        return redirect("/productcomposer");
      },
    },
    {
      path: "/cataloguecomposer",
      element: (
        <TopBar>
          <CatalogueComposer />
        </TopBar>
      ),
      errorElement: (
        <TopBar>
          <ErrorPage />
        </TopBar>
      ),
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
      errorElement: (
        <TopBar>
          <ErrorPage />
        </TopBar>
      ),
    },
  ]);

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
