import { ErrorPage } from "@3dwebprodconf/shared/src/components/ErrorPage.tsx";
import { useDarkMode } from "@3dwebprodconf/shared/src/hooks/useDarkMode.ts";
import { t } from "i18next";
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
import { CatalogActions } from "./stores/actions/CatalogActions.ts";
import { ProductSpecificationActions } from "./stores/actions/ProductSpecificationActions.ts";
import { CatalogStore } from "./stores/CatalogStore.ts";
import { ProductSpecificationStore } from "./stores/ProductSpecificationStore.ts";
import { UserCreationStore } from "./stores/UserCreationStore.ts";
import { fetchProductSpecification } from "./utilities/Fetching.ts";

const ProductEditor = lazy(
  () => import("./components/pages/ProductEditor/ProductEditor.tsx")
);

async function loadCatalogWithValidProduct(productId?: string) {
  const catalog = await CatalogActions.getCatalog(
    globalConfig.config.sources.catalogUrl,
    CatalogStore
  );
  const products = catalog?.products;
  if (productId && !products[productId]) {
    throw Error(t("errorNoProductInCatalog", { productId: productId }));
  }
  return products;
}

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <ProductSelection />,
    loader: async () => {
      return await loadCatalogWithValidProduct();
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
        throw Error(t("errorNoProduct"));
      }

      const products = await loadCatalogWithValidProduct(params.productId);
      const productSpecification = await fetchProductSpecification(
        products[params.productId].productSpecificationUrl
      );
      ProductSpecificationActions.storeProductSpecification(
        productSpecification,
        ProductSpecificationStore
      );

      UserCreationStore.value.product = params.productId;

      return productSpecification;
    },
  },
  {
    path: "/confirm/:productId",
    errorElement: <ErrorPage />,
    element: <ProductConfirmation />,
    loader: ({ params }) => {
      if (!params.productId) {
        throw Error(t("errorNoProduct"));
      }

      if (
        !UserCreationStore.value.isBaseSet ||
        UserCreationStore.value.product !== params.productId
      ) {
        return redirect("/editor/" + params.productId);
      }

      return null;
    },
  },
]);

export const AppContent = () => {
  const isDarkmode = useDarkMode();

  return (
    <div className="app flex h-dvh flex-col">
      <div className="other-background z-[90] block border-b border-gray-200 p-2 shadow-sm dark:border-zinc-700">
        <a
          href={globalConfig.config.sources.homepageUrl}
          className="ml-2 inline-flex h-full items-center"
        >
          <img
            src={
              isDarkmode
                ? globalConfig.config.images.logo.dark
                : globalConfig.config.images.logo.light
            }
            alt={"logo"}
            className="max-h-12"
          />
        </a>
      </div>
      <Toaster position="top-right" reverseOrder={true} />
      <RouterProvider router={router} />
    </div>
  );
};
