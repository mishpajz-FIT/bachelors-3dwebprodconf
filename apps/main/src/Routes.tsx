import { ErrorPage } from "@3dwebprodconf/shared/src/components/ErrorPage.tsx";
import { t } from "i18next";
import { lazy, Suspense } from "react";
import { redirect, RouteObject } from "react-router-dom";

import { ProductConfirmation } from "./components/pages/ProductConfirmation/ProductConfirmation.tsx";
import { ProductSelection } from "./components/pages/ProductSelection/ProductSelection.tsx";
import { globalConfig } from "./configurations/Config.ts";
import { CatalogActions } from "./stores/actions/CatalogActions.ts";
import { ProductSpecificationActions } from "./stores/actions/ProductSpecificationActions.ts";
import { CatalogStore } from "./stores/CatalogStore.ts";
import { ProductSpecificationStore } from "./stores/ProductSpecificationStore.ts";
import { UserCreationStore } from "./stores/UserCreationStore.ts";
import { fetchProductSpecification } from "./utilities/Fetching.ts";

// eslint-disable-next-line react-refresh/only-export-components
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

export const routes: RouteObject[] = [
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <ProductSelection />,
    loader: async () => {
      UserCreationStore.goTo(0);
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

      if (UserCreationStore.value.product != params.productId) {
        UserCreationStore.goTo(0);
        UserCreationStore.value.product = params.productId;
        UserCreationStore.saveHistory();
      }

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
];
