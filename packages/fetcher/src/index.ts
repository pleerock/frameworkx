// if fetch doesn't exist in the environment, we just patch it
if (!globalThis.fetch) {
  globalThis.fetch = require("node-fetch")
}

export * from "./fetcher-factory"
export * from "./fetcher-error-classes"
export * from "./fetcher-query-builder-types"
export * from "./fetcher-types"
