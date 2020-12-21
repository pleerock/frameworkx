// unfortunately we have to patch it this way,
// to make JSON.stringify to work for big int
if (!(BigInt.prototype as any)["toJSON"]) {
  ;(BigInt.prototype as any)["toJSON"] =
    (BigInt.prototype as any)["toJSON"] ||
    function (this: bigint) {
      return this.toString()
    }
}

export * from "./build-graphql-schema-fn"
export * from "./naming-strategy"
export * from "./default-naming-strategy"
