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

    const number = postType.getFields()["number"]
    expect(number).not.toBe(undefined)
    if (!isNonNullType(number.type)) fail(`"number" is nullable`)
    expect(isScalarType(number.type.ofType)).toBe(true)
    expect(number.type.ofType.name).toBe("Int")

    const numberUndefined = postType.getFields()["numberUndefined"]
    expect(numberUndefined).not.toBe(undefined)
    if (!isNullableType(numberUndefined.type))
      fail(`"numberUndefined" is not nullable`)
    if (!isScalarType(numberUndefined.type))
      fail(`"numberUndefined" is not scalar`)
    expect(numberUndefined.type.name).toBe("Int")

    const numberNullable = postType.getFields()["numberNullable"]
    expect(numberNullable).not.toBe(undefined)
    if (!isNullableType(numberNullable.type))
      fail(`"numberNullable" is not nullable`)
    if (!isScalarType(numberNullable.type))
      fail(`"numberNullable" is not scalar`)
    expect(numberNullable.type.name).toBe("Int")
  })
})
