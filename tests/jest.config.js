module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/src/**/**/**/index.ts"],
  cacheDirectory: "_/jest-cache",
  automock: false,
}
