import { ErrorPage } from "@3dwebprodconf/shared/src/components/ErrorPage.tsx";
import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";

import { ProductConfirmation } from "./components/pages/ProductConfirmation/ProductConfirmation.tsx";
import { ProductSelection } from "./components/pages/ProductSelection/ProductSelection.tsx";
import { globalConfig } from "./configurations/Config.ts";
import { CatalogueActions } from "./stores/actions/CatalogueActions.ts";
import { ProductSpecificationActions } from "./stores/actions/ProductSpecificationActions.ts";
import { CatalogueStore } from "./stores/CatalogueStore.ts";
import { ConfiguratorValuesStore } from "./stores/ConfiguratorValuesStore.ts";
import { ProductSpecificationStore } from "./stores/ProductSpecificationStore.ts";
import { UserCreationStore } from "./stores/UserCreationStore.ts";
import { fetchProductSpecification } from "./utilities/Fetching.ts";

const ProductEditor = lazy(
  () => import("./components/pages/ProductEditor/ProductEditor.tsx")
);

async function loadCatalogueWithValidProduct(productId?: string) {
  const catalogue = await CatalogueActions.getCatalogue(
    globalConfig.config.sources.catalogueUrl,
    CatalogueStore
  );
  const products = catalogue?.products;
  if (productId && !products[productId]) {
    throw Error("Product not found in catalogue.");
  }
  return products;
}

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <ProductSelection />,
    loader: async () => {
      return await loadCatalogueWithValidProduct();
    },
  },
  {
    path: "/editor/:productId",
    element: (
      <Suspense fallback={<div className="content-background size-full" />}>
        <ProductEditor />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    loader: async ({ params }) => {
      if (!params.productId) {
        throw Error("Missing product.");
      }

      const products = await loadCatalogueWithValidProduct(params.productId);
      const productSpecification = await fetchProductSpecification(
        products[params.productId].productSpecificationUrl
      );
      ProductSpecificationActions.storeProductSpecification(
        productSpecification,
        ProductSpecificationStore
      );

      ConfiguratorValuesStore.currentProductId = params.productId;

      return productSpecification;
    },
  },
  {
    path: "/confirm/:productId",
    errorElement: <ErrorPage />,
    element: <ProductConfirmation />,
    loader: ({ params }) => {
      if (!params.productId) {
        throw Error("Missing product.");
      }

      if (!UserCreationStore.isBaseSet) {
        return redirect("/editor/" + params.productId);
      }

      return null;
    },
  },
]);

export const AppContent = () => {
  return (
    <div className="app flex h-dvh flex-col">
      <div className="other-background z-[100] border-b border-gray-200 p-2 shadow-sm dark:border-zinc-700">
        <img src={"/logo.svg"} alt={"logo"} className="ml-2 max-h-12" />
      </div>

      <Toaster position="top-right" reverseOrder={true} />
      <RouterProvider router={router} />
    </div>
  );
};
