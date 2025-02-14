module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:@react-three/recommended",
    "plugin:valtio/recommended",
    "plugin:tailwindcss/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended"
  ],
  ignorePatterns: [
    "dist",
    ".eslintrc.cjs",
    "postcss.config.js",
    "tailwind.config.js",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["react", "react-refresh", "@react-three", "import", "jsx-a11y"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react/prop-types": "off",
    "react/no-unknown-property": [
      "error",
      {
        ignore: [
          "object",
          "position",
          "args",
          "attach",
          "rotation",
          "transparent",
          "makeDefault",
          "intensity",
          "groundColor",
          "castShadow",
          "receiveShadow",
          "depthTest",
          "geometry",
          "material",
          "userData",
          "matrixAutoUpdate"
        ],
      },
    ],
    "semi": [
      "error",
      "always",
      {
        omitLastInOneLineBlock: false,
        omitLastInOneLineClassBody: false,
      },
    ],
    "eol-last": ["warn", "always"],
    "import/order": [
      "warn",
      {
        groups: [
          ["builtin", "external"],
          "internal",
          ["parent", "sibling", "index"],
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ]
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: [
      "./apps/main/tsconfig.json",
      "./apps/main/tsconfig.node.json",
      "./packages/shared/tsconfig.json",
      "./apps/admin/tsconfig.json",
      "./apps/admin/tsconfig.node.json"
    ],
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
