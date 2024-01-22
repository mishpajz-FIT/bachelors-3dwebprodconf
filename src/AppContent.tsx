import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";

import { ProductConfirmation } from "./components/2d/concrete/ProductConfirmation/ProductConfirmation.tsx";
import { ProductEditor } from "./components/2d/concrete/ProductEditor/ProductEditor.tsx";
import { ProductSelection } from "./components/2d/concrete/ProductSelection/ProductSelection.tsx";
import { ErrorPage } from "./components/2d/ErrorPage.tsx";
import { fetchProductSpecification } from "./stores/actions/ProductSpecificationActions.ts";
import { EditorValuesStore } from "./stores/EditorValuesStore.ts";
import { ProductSpecificationStore } from "./stores/ProductSpecificationStore.ts";
import { ProductsStore } from "./stores/ProductsStore.ts";
import { UserProductStore } from "./stores/UserProductStore.ts";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <ProductSelection />,
  },
  {
    path: "/:productId/editor",
    element: <ProductEditor />,
    errorElement: <ErrorPage />,
    loader: async ({ params }) => {
      if (!params.productId) {
        throw Error("Wrong ProductID.");
      }

      const products = await ProductsStore.products;
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

      EditorValuesStore.currentProductId = params.productId;

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

      const products = await ProductsStore.products;
      if (!products) {
        throw Error("Products not found.");
      }

      if (!products[params.productId]) {
        throw Error("Product not found.");
      }

      if (!UserProductStore.isBaseSet) {
        return redirect("/" + params.productId + "/editor");
      }

      return null;
    },
  },
]);

export const AppContent = () => {
  return (
    <div className="app flex h-dvh flex-col">
      <div className="z-10 border-b border-gray-200 bg-white p-2 shadow-sm dark:border-gray-600 dark:bg-gray-900">
        <img src={"/vite.svg"} alt={"logo"} className="ml-2 max-h-12" />
      </div>

      <RouterProvider router={router} />
    </div>
  );
};
