import { GraphQLScalarType, Kind } from "graphql"

// unfortunately we have to patch it this way,
// to make JSON.stringify to work for big int
if (!(BigInt.prototype as any)["toJSON"]) {
  ;(BigInt.prototype as any)["toJSON"] =
    (BigInt.prototype as any)["toJSON"] ||
    function (this: bigint) {
      return this.toString()
    }
}

/**
 * GraphQL type for a BitInt scalar type.
 */
export const GraphQLBigInt = new GraphQLScalarType({
  name: "BigInt",
  description:
    "BigInt is a built-in object that provides a way to represent whole numbers larger than 253 - 1.",
  serialize: (value) => BigInt(value),
  parseValue: (value) => BigInt(value),
  parseLiteral(ast) {
    if (
      ast.kind === Kind.INT ||
      ast.kind === Kind.FLOAT ||
      ast.kind === Kind.STRING
    ) {
      return BigInt(ast.value)
    }
    return null
  },
})
