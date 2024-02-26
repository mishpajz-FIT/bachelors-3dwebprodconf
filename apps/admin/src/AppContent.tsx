import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from "@3dwebprodconf/shared/src/components/ErrorPage.tsx";

export const AppContent = () => {
  const ProductComposer = lazy(
    () => import("./components/2d/ProductComposer/ProductComposer.tsx")
  );

  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <ErrorPage />,
      element: (
        <Suspense fallback={<div className="content-background size-full" />}>
          <ProductComposer />
        </Suspense>
      ),
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
      <div className="other-background z-10 h-12 border-b border-gray-200 p-2 shadow-sm dark:border-zinc-700">
        Product Composer
      </div>

      <RouterProvider router={router} />
    </div>
  );
};
