module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["src"],
  testMatch: ["**/src/**/**/**/index.ts"],
  cacheDirectory: "_/jest-cache",
  automock: false,
}
