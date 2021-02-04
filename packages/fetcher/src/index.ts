// if fetch doesn't exist in the environment, we patch it
if (!globalThis.fetch) {
  globalThis.fetch = require("node-fetch")
}

// unfortunately we have to patch it this way,
// to make JSON.stringify to work for big int
if (
  globalThis.BigInt &&
  globalThis.BigInt.prototype &&
  !(globalThis.BigInt.prototype as any)["toJSON"]
) {
  ;(globalThis.BigInt.prototype as any)["toJSON"] =
    (globalThis.BigInt.prototype as any)["toJSON"] ||
    function (this: bigint) {
      return this.toString()
    }
}

export * from "./fetcher-type"
export * from "./fetcher-options-type"
export * from "./fetcher-query-builder-types"
export * from "./fetcher-query-builder-factory"
export * from "./fetcher-factory"
export * from "./fetcher-error-classes"
