module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
  ],
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  moduleNameMapper: {},
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  testEnvironment: "node",
};
