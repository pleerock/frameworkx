import { parse } from "@microframework/parser"
import {
  ApplicationServerUtils,
  GraphQLSchemaBuilder,
  LoggerHelper,
} from "@microframework/node"
import { debugLogger } from "@microframework/logger"
import {
  isNonNullType,
  isNullableType,
  isObjectType,
  isScalarType,
} from "graphql"

describe("graphql > scalar model app", () => {
  test("model defined with a scalar type properties", () => {
    const result = parse(__dirname + "/scalar-model-app.ts")
    const loggerHelper = new LoggerHelper(debugLogger)
    const options = {
      appPath: __dirname + "/App",
      webserver: {
        port: 4000,
        cors: true,
      },
      websocket: {
        host: "localhost",
        port: 5000,
      },
      graphql: {
        graphiql: true,
        playground: true,
      },
      resolvers: {},
    }
    const builder = new GraphQLSchemaBuilder(
      loggerHelper,
      result,
      ApplicationServerUtils.optionsToProperties(options),
      undefined,
    )

    const schema = builder.build()
    const postType = schema.getType("PostType")
    expect(postType).not.toBe(undefined)

    if (!isObjectType(postType)) fail("PostType is not an object")
    expect(postType.name).toBe("PostType")
    expect(postType.description).toBe("This way we are testing type support.")

    // ------------------------------------------------

    const id = postType.getFields()["id"]
    expect(id).not.toBe(undefined)
    if (!isNonNullType(id.type)) fail(`"id" is nullable`)
    expect(isScalarType(id.type.ofType)).toBe(true)
    expect(id.type.ofType.name).toBe("Int")

    const idUndefined = postType.getFields()["idUndefined"]
    expect(idUndefined).not.toBe(undefined)
    if (!isNullableType(idUndefined.type)) fail(`"idUndefined" is not nullable`)
    if (!isScalarType(idUndefined.type)) fail(`"idUndefined" is not scalar`)
    expect(idUndefined.type.name).toBe("Int")

    const idNullable = postType.getFields()["idNullable"]
    expect(idNullable).not.toBe(undefined)
    if (!isNullableType(idNullable.type)) fail(`"idNullable" is not nullable`)
    if (!isScalarType(idNullable.type)) fail(`"idNullable" is not scalar`)
    expect(idNullable.type.name).toBe("Int")

    // ------------------------------------------------

    const name = postType.getFields()["name"]
    expect(name).not.toBe(undefined)
    if (!isNonNullType(name.type)) fail(`"name" is nullable`)
    expect(isScalarType(name.type.ofType)).toBe(true)
    expect(name.type.ofType.name).toBe("String")

    // ------------------------------------------------

    const title = postType.getFields()["title"]
    expect(title).not.toBe(undefined)
    if (!isNullableType(title.type)) fail(`"title" is not nullable`)
    if (!isScalarType(title.type)) fail(`"title" is not scalar`)
    expect(title.type.name).toBe("String")

    // -----------------------

    const text = postType.getFields()["text"]
    expect(text).not.toBe(undefined)
    if (!isNullableType(text.type)) fail(`"text" is not nullable`)
    if (!isScalarType(text.type)) fail(`"text" is not scalar`)
    expect(text.type.name).toBe("String")

    // -----------------------

    const isWatched = postType.getFields()["isWatched"]
    expect(isWatched).not.toBe(undefined)
    if (!isNonNullType(isWatched.type)) fail(`"isWatched" is nullable`)
    expect(isScalarType(isWatched.type.ofType)).toBe(true)
    expect(isWatched.type.ofType.name).toBe("Boolean")

    // -----------------------

    const rating = postType.getFields()["rating"]
    expect(rating).not.toBe(undefined)
    if (!isNonNullType(rating.type)) fail(`"rating" is nullable`)
    expect(isScalarType(rating.type.ofType)).toBe(true)
    expect(rating.type.ofType.name).toBe("Float")

    // -----------------------

    const bigint1 = postType.getFields()["bigint1"]
    expect(bigint1).not.toBe(undefined)
    if (!isNonNullType(bigint1.type)) fail(`"bigint1" is nullable`)
    expect(isScalarType(bigint1.type.ofType)).toBe(true)
    expect(bigint1.type.ofType.name).toBe("BigInt")

    // -----------------------

    const bigint2 = postType.getFields()["bigint2"]
    expect(bigint2).not.toBe(undefined)
    if (!isNonNullType(bigint2.type)) fail(`"bigint2" is nullable`)
    expect(isScalarType(bigint2.type.ofType)).toBe(true)
    expect(bigint2.type.ofType.name).toBe("BigInt")

    // -----------------------

    const date = postType.getFields()["date"]
    expect(date).not.toBe(undefined)
    if (!isNonNullType(date.type)) fail(`"date" is nullable`)
    expect(isScalarType(date.type.ofType)).toBe(true)
    expect(date.type.ofType.name).toBe("Date")

    // -----------------------

    const dateTime = postType.getFields()["dateTime"]
    expect(dateTime).not.toBe(undefined)
    if (!isNonNullType(dateTime.type)) fail(`"dateTime" is nullable`)
    expect(isScalarType(dateTime.type.ofType)).toBe(true)
    expect(dateTime.type.ofType.name).toBe("DateTime")

    // -----------------------

    const time = postType.getFields()["time"]
    expect(time).not.toBe(undefined)
    if (!isNonNullType(time.type)) fail(`"time" is nullable`)
    expect(isScalarType(time.type.ofType)).toBe(true)
    expect(time.type.ofType.name).toBe("Time")
  })
})
