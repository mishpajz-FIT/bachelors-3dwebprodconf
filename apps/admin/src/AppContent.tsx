import { ErrorPage } from "@3dwebprodconf/shared/src/components/ErrorPage.tsx";
import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";

import { CatalogueComposer } from "./components/2d/CatalogueComposer/CatalogueComposer.tsx";
import { TopBar } from "./TopBar.tsx";
import { Toaster } from "react-hot-toast";

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
    <div className="app flex h-dvh flex-col">
      <Toaster position="top-right" reverseOrder={true} />
      <RouterProvider router={router} />
    </div>
  );
};
