# 3dwebprodconf-fe

Part of Michal Dobeš's bachelor's thesis at the Faculty of Information Technology, Czech Technical University.

Implementation of a product-agnostic, front-end-only, customizable online 3D web configurator for modular products. The application is conceived for use by small businesses. The configurator provides a straightforward definition of configurable products and operates solely using a web server. The implementation leverages modern technologies, combining Three.js with React.

This is a monorepo, split into two applications:
- `apps/main` - the main application, the configurator itself
- `apps/admin` - the administrator application, for managing the configuration of products

along with a shared library:
- `packages/shared` - shared code between the two applications

## Installation

### Prerequisites
- Node.js
- npm

### Steps for deploying the configurator application

1. Clone the repository
2. Install dependencies
    ```bash
    npm install
    ```
3. Build the applications
    ```bash
    npm run build --workspace=main
    ```
4. Use a web server to serve the `apps/main/dist` directory

### Steps for running the administrator application

1. Clone the repository
2. Install dependencies
    ```bash
    npm install
    ```
3. Build the application
    ```bash
    npm run build --workspace=admin
    ```
4. Run the development server (the administrator application is needed only for the product setup, and can be run locally)
    ```bash
    npm run preview --workspace=admin
    ```

### Other commands

- `npm run build` - builds both applications
- `npm run lint` - lints the codebase
- `npm run fix` - fixes linting issues in the codebase
- `npm run test` - executes unit tests
- `npm run dev` - runs the development server for the configurator application
- `npm run dev-admin` - runs the development server for the administrator application

## Configuration

The configurator application can be setup using the `appconfig.json` file located in the `apps/main/public` directory. The file contains the following properties:
```json
{
  camera: {
    isOrthogonal: false, // whether the camera is orthogonal
  },
  shadows: {
    floorShadow: false, // whether the floor casts a shadow (performance expensive)
  },
  spatialUi: {
    selectionColors: {
      outline: { // outline color for the 3D selection
        light: "#000000",
        dark: "#FFFFFF",
      },
    },
    controls: { 
      swapMouseButtons: false, // whether to swap the left and right mouse buttons
    },
  },
  ui: {
    languages: { 
      default: "en", // fallback language
      all: ["en"], // all available languages
    },
    colors: {
      primary: { // primary color of interface
        light: "#3377ff",
        dark: "#0011ff",
        overlayTextWhiteLight: true, // whether the overlay text should be white in lightmode (when overlaying the primary color)
        overlayTextWhiteDark: true, // whether the overlay text should be white in darkmode (when overlaying the primary color)
      },
      error: { // error color
        dark: "#f43f5e",
        light: "#f43f5e",
      },
    },
  },
  sources: {
    catalogUrl: "/products/catalogue.json", // URL to the product catalog
    homepageUrl: "/", // URL to the homepage
  },
  capabilities: {
    savePdfButton: true, // whether the save PDF button is displayed
  },
  images: {
    logo: { // logo image
      light: "/logo.svg",
      dark: "/logo.svg",
    },
    favicon: "/logo.svg", // favicon
  },
  title: "3dwebprodconf", // title of the application
  debug: {
    collisionDetectionDisplay: false, // whether the collision detection debug is enabled (visually displays the collision boxes)
  },
}
```

### Languages

Interface texts of the configurator application can be adjusted (along with adding other language variants) by editing the `apps/main/public/locales/{language}/translation.json` files, where `{language}` is a two-letter code of the language. The language variants need to be registered  in the `appconfig.json` file.

### Product setup

The product setup is performed in the administration application. The application contains two screens:
- `Catalog Composer` - for defining the catalog of all products, which points to the individual product specifications
- `Product Composer` - for defining the specification of single product

Therefore, a `catalog.json` file, along with the product specifications JSON files needs to be created.
The location of catalog file is defined in the `appconfig.json` file, and the locations of product specifications are located in the `catalog.json` file.

The administrator application allows the import and export of the catalog and product specifications JSON files, allowing the updates of its values.

It is important to note, that the models, images and files need to be accessible from the configurator application. The paths to these files are defined in the catalong and product specifications JSON files.

##### Confirmation action

The product within the catalog can have the following confirmation actions:
1. Preview - no confirmation action
2. Redirect - redirects to a specified URL
3. Callback - sends a POST request to a specified URL, containg the schema of configured product in a JSON body (see `packages/shared/src/schemas/UserCreation.ts` for the schema)
4. Inquiry form - displays a form for the user to fill in, and continues the same as the callback action, with the form data in `contact` field of the JSON body (see `packages/shared/src/schemas/network/ContactInfo.ts` for the schema of contact information)

### Example

This repository provides an example configurable modular kitchen product. An example `catalog.json` file and a product specification file for kitchen configuration is provided. The files are located in the `apps/main/public/products` directory.

<sub><sup>The assets for the example product are not included in the Work and are absent from the repository. The 3D models are adapted from [Sketchfab - Thiago Noguiera](https://sketchfab.com/3d-models/modular-kitchen-sink-game-ready-asset-031236e2ddde456da9b2e7eb0e74370d) and do not fall under the permissive license.</sup></sub>

## License

The application is free to use under a permissive licence. See the [LICENSE](LICENSE) file for more information.