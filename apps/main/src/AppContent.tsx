import { ErrorPage } from "@3dwebprodconf/shared/src/components/ErrorPage.tsx";
import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";

import { ProductConfirmation } from "./components/2d/ProductConfirmation/ProductConfirmation.tsx";
import { ProductSelection } from "./components/2d/ProductSelection/ProductSelection.tsx";
import { globalConfig } from "./configurations/Config.ts";
import { getCatalogue } from "./stores/actions/CatalogueActions.ts";
import { fetchProductSpecification } from "./stores/actions/ProductSpecificationActions.ts";
import { ConfiguratorValuesStore } from "./stores/ConfiguratorValuesStore.ts";
import { ProductSpecificationStore } from "./stores/ProductSpecificationStore.ts";
import { UserCreationStore } from "./stores/UserCreationStore.ts";

const ProductEditor = lazy(
  () => import("./components/2d/ProductEditor/ProductEditor.tsx")
);

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <ProductSelection />,
    loader: async () => {
      const catalogue = await getCatalogue(
        globalConfig.config.sources.catalogueUrl
      );
      const products = catalogue.products;
      if (!products) {
        throw Error("Products not found.");
      }

      return products;
    },
  },
  {
    path: "/:productId/editor",
    element: (
      <Suspense fallback={<div className="content-background size-full" />}>
        <ProductEditor />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    loader: async ({ params }) => {
      if (!params.productId) {
        throw Error("Wrong ProductID.");
      }

      const catalogue = await getCatalogue(
        globalConfig.config.sources.catalogueUrl
      );
      const products = catalogue.products;
      if (!products) {
        throw Error("Products not found.");
      }
      const productSpecificationUrl =
        products[params.productId].productSpecificationUrl;

      const productSpecification = await fetchProductSpecification(
        productSpecificationUrl
      );

      ProductSpecificationStore.baseSpecs = productSpecification.baseSpecs;
      ProductSpecificationStore.componentSpecs =
        productSpecification.componentSpecs;

      ConfiguratorValuesStore.currentProductId = params.productId;

      return productSpecification;
    },
  },
  {
    path: "/:productId/confirm",
    errorElement: <ErrorPage />,
    element: <ProductConfirmation />,
    loader: async ({ params }) => {
      if (!params.productId) {
        throw Error("Wrong ProductID.");
      }

      const catalogue = await getCatalogue(
        globalConfig.config.sources.catalogueUrl
      );
      const products = catalogue.products;
      if (!products) {
        throw Error("Products not found.");
      }

      if (!products[params.productId]) {
        throw Error("Product not found.");
      }

      if (!UserCreationStore.isBaseSet) {
        return redirect("/" + params.productId + "/editor");
      }

      return null;
    },
  },
]);

export const AppContent = () => {
  return (
    <div className="app flex h-dvh flex-col">
      <div className="other-background z-10 border-b border-gray-200 p-2 shadow-sm dark:border-zinc-700">
        <img src={"/logo.svg"} alt={"logo"} className="ml-2 max-h-12" />
      </div>

      <RouterProvider router={router} />
    </div>
  );
};
