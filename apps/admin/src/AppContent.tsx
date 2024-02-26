import { ErrorPage } from "@3dwebprodconf/shared/src/components/ErrorPage.tsx";
import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Link,
  redirect,
  RouterProvider,
} from "react-router-dom";

import { CatalogueComposer } from "./components/2d/CatalogueComposer/CatalogueComposer.tsx";

export const AppContent = () => {
  const ProductComposer = lazy(
    () => import("./components/2d/ProductComposer/ProductComposer.tsx")
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <></>,
      errorElement: <ErrorPage />,
      loader: () => {
        return redirect("/productcomposer");
      },
    },
    {
      path: "/cataloguecomposer",
      element: <CatalogueComposer />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/productcomposer",
      element: (
        <Suspense fallback={<div className="content-background size-full" />}>
          <ProductComposer />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
  ]);

  return (
    <div className="app flex h-dvh flex-col">
      <div className="other-background z-10 flex h-12 flex-row items-center justify-center gap-10 border-b border-gray-200 p-2 shadow-sm dark:border-zinc-700">
        <Link to="/cataloguecomposer" className="">
          Catalogue Composer
        </Link>
        <Link to="/productcomposer" className="">
          Product Composer
        </Link>
      </div>

      <RouterProvider router={router} />
    </div>
  );
};
