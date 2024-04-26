/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  rootDir: "./",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules"],
  moduleFileExtensions: ["ts", "js"],
  projects: [
    {
      displayName: "Main",
      testEnvironment: "jsdom",
      transform: {
        "^.+\\.ts?$": [
          "ts-jest",
          {
            tsconfig: "<rootDir>/apps/main/tsconfig.json",
          },
        ],
      },
    },
  ],
};
