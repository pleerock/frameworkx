// if fetch doesn't exist in the environment, we patch it
if (!globalThis.fetch) {
  globalThis.fetch = require("node-fetch")
}

export * from "./fetcher-type"
export * from "./fetcher-options-type"
export * from "./fetcher-query-builder-types"
export * from "./fetcher-query-builder-factory"
export * from "./fetcher-factory"
export * from "./fetcher-error-classes"
