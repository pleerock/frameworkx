import { parse } from "@microframework/parser"
import {
  ApplicationServerUtils,
  GraphQLSchemaBuilder,
  LoggerHelper,
} from "@microframework/node"
import { debugLogger } from "@microframework/logger"
import {
  isInputObjectType,
  isNonNullType,
  isNullableType,
  isScalarType,
} from "graphql"

describe("graphql > schema builder", () => {
  test("input (referenced type) with scalar properties", () => {
    const result = parse(__dirname + "/reference-input-scalars-app.ts")
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
    const postInput = schema.getType("PostInput")
    expect(postInput).not.toBe(undefined)

    if (!isInputObjectType(postInput)) fail("PostInput is not an object")
    expect(postInput.name).toBe("PostInput")
    expect(postInput.description).toBe("This way we are testing type support.")

    // ------------------------------------------------

    const number = postInput.getFields()["number"]
    expect(number).not.toBe(undefined)
    if (!isNonNullType(number.type)) fail(`"number" is nullable`)
    expect(isScalarType(number.type.ofType)).toBe(true)
    expect(number.type.ofType.name).toBe("Int")

    const numberUndefined = postInput.getFields()["numberUndefined"]
    expect(numberUndefined).not.toBe(undefined)
    if (!isNullableType(numberUndefined.type))
      fail(`"numberUndefined" is not nullable`)
    if (!isScalarType(numberUndefined.type))
      fail(`"numberUndefined" is not scalar`)
    expect(numberUndefined.type.name).toBe("Int")

    const numberNullable = postInput.getFields()["numberNullable"]
    expect(numberNullable).not.toBe(undefined)
    if (!isNullableType(numberNullable.type))
      fail(`"numberNullable" is not nullable`)
    if (!isScalarType(numberNullable.type))
      fail(`"numberNullable" is not scalar`)
    expect(numberNullable.type.name).toBe("Int")

    // ------------------------------------------------

    const string = postInput.getFields()["string"]
    expect(string).not.toBe(undefined)
    if (!isNonNullType(string.type)) fail(`"string" is nullable`)
    expect(isScalarType(string.type.ofType)).toBe(true)
    expect(string.type.ofType.name).toBe("String")

    const stringUndefined = postInput.getFields()["stringUndefined"]
    expect(stringUndefined).not.toBe(undefined)
    if (!isNullableType(stringUndefined.type))
      fail(`"stringUndefined" is not nullable`)
    if (!isScalarType(stringUndefined.type))
      fail(`"stringUndefined" is not scalar`)
    expect(stringUndefined.type.name).toBe("String")

    const stringNullable = postInput.getFields()["stringNullable"]
    expect(stringNullable).not.toBe(undefined)
    if (!isNullableType(stringNullable.type))
      fail(`"stringNullable" is not nullable`)
    if (!isScalarType(stringNullable.type))
      fail(`"stringNullable" is not scalar`)
    expect(stringNullable.type.name).toBe("String")

    // ------------------------------------------------

    const boolean = postInput.getFields()["boolean"]
    expect(boolean).not.toBe(undefined)
    if (!isNonNullType(boolean.type)) fail(`"boolean" is nullable`)
    expect(isScalarType(boolean.type.ofType)).toBe(true)
    expect(boolean.type.ofType.name).toBe("Boolean")

    const booleanUndefined = postInput.getFields()["booleanUndefined"]
    expect(booleanUndefined).not.toBe(undefined)
    if (!isNullableType(booleanUndefined.type))
      fail(`"booleanUndefined" is not nullable`)
    if (!isScalarType(booleanUndefined.type))
      fail(`"booleanUndefined" is not scalar`)
    expect(booleanUndefined.type.name).toBe("Boolean")

    const booleanNullable = postInput.getFields()["booleanNullable"]
    expect(booleanNullable).not.toBe(undefined)
    if (!isNullableType(booleanNullable.type))
      fail(`"booleanNullable" is not nullable`)
    if (!isScalarType(booleanNullable.type))
      fail(`"booleanNullable" is not scalar`)
    expect(booleanNullable.type.name).toBe("Boolean")

    // ------------------------------------------------

    const float = postInput.getFields()["float"]
    expect(float).not.toBe(undefined)
    if (!isNonNullType(float.type)) fail(`"float" is nullable`)
    expect(isScalarType(float.type.ofType)).toBe(true)
    expect(float.type.ofType.name).toBe("Float")

    const floatUndefined = postInput.getFields()["floatUndefined"]
    expect(floatUndefined).not.toBe(undefined)
    if (!isNullableType(floatUndefined.type))
      fail(`"floatUndefined" is not nullable`)
    if (!isScalarType(floatUndefined.type))
      fail(`"floatUndefined" is not scalar`)
    expect(floatUndefined.type.name).toBe("Float")

    const floatNullable = postInput.getFields()["floatNullable"]
    expect(floatNullable).not.toBe(undefined)
    if (!isNullableType(floatNullable.type))
      fail(`"floatNullable" is not nullable`)
    if (!isScalarType(floatNullable.type)) fail(`"floatNullable" is not scalar`)
    expect(floatNullable.type.name).toBe("Float")

    // ------------------------------------------------

    const bigint = postInput.getFields()["bigint"]
    expect(bigint).not.toBe(undefined)
    if (!isNonNullType(bigint.type)) fail(`"bigint" is nullable`)
    expect(isScalarType(bigint.type.ofType)).toBe(true)
    expect(bigint.type.ofType.name).toBe("BigInt")

    const bigintUndefined = postInput.getFields()["bigintUndefined"]
    expect(bigintUndefined).not.toBe(undefined)
    if (!isNullableType(bigintUndefined.type))
      fail(`"bigintUndefined" is not nullable`)
    if (!isScalarType(bigintUndefined.type))
      fail(`"bigintUndefined" is not scalar`)
    expect(bigintUndefined.type.name).toBe("BigInt")

    const bigintNullable = postInput.getFields()["bigintNullable"]
    expect(bigintNullable).not.toBe(undefined)
    if (!isNullableType(bigintNullable.type))
      fail(`"bigintNullable" is not nullable`)
    if (!isScalarType(bigintNullable.type))
      fail(`"bigintNullable" is not scalar`)
    expect(bigintNullable.type.name).toBe("BigInt")

    // ------------------------------------------------

    const bigintObj = postInput.getFields()["bigintObj"]
    expect(bigintObj).not.toBe(undefined)
    if (!isNonNullType(bigintObj.type)) fail(`"bigintObj" is nullable`)
    expect(isScalarType(bigintObj.type.ofType)).toBe(true)
    expect(bigintObj.type.ofType.name).toBe("BigInt")

    const bigintObjUndefined = postInput.getFields()["bigintObjUndefined"]
    expect(bigintObjUndefined).not.toBe(undefined)
    if (!isNullableType(bigintObjUndefined.type))
      fail(`"bigintObjUndefined" is not nullable`)
    if (!isScalarType(bigintObjUndefined.type))
      fail(`"bigintObjUndefined" is not scalar`)
    expect(bigintObjUndefined.type.name).toBe("BigInt")

    const bigintObjNullable = postInput.getFields()["bigintObjNullable"]
    expect(bigintObjNullable).not.toBe(undefined)
    if (!isNullableType(bigintObjNullable.type))
      fail(`"bigintObjNullable" is not nullable`)
    if (!isScalarType(bigintObjNullable.type))
      fail(`"bigintObjNullable" is not scalar`)
    expect(bigintObjNullable.type.name).toBe("BigInt")

    // ------------------------------------------------

    const date = postInput.getFields()["date"]
    expect(date).not.toBe(undefined)
    if (!isNonNullType(date.type)) fail(`"date" is nullable`)
    expect(isScalarType(date.type.ofType)).toBe(true)
    expect(date.type.ofType.name).toBe("Date")

    const dateUndefined = postInput.getFields()["dateUndefined"]
    expect(dateUndefined).not.toBe(undefined)
    if (!isNullableType(dateUndefined.type))
      fail(`"dateUndefined" is not nullable`)
    if (!isScalarType(dateUndefined.type)) fail(`"dateUndefined" is not scalar`)
    expect(dateUndefined.type.name).toBe("Date")

    const dateNullable = postInput.getFields()["dateNullable"]
    expect(dateNullable).not.toBe(undefined)
    if (!isNullableType(dateNullable.type))
      fail(`"dateNullable" is not nullable`)
    if (!isScalarType(dateNullable.type)) fail(`"dateNullable" is not scalar`)
    expect(dateNullable.type.name).toBe("Date")

    // ------------------------------------------------

    const dateTime = postInput.getFields()["dateTime"]
    expect(dateTime).not.toBe(undefined)
    if (!isNonNullType(dateTime.type)) fail(`"dateTime" is nullable`)
    expect(isScalarType(dateTime.type.ofType)).toBe(true)
    expect(dateTime.type.ofType.name).toBe("DateTime")

    const dateTimeUndefined = postInput.getFields()["dateTimeUndefined"]
    expect(dateTimeUndefined).not.toBe(undefined)
    if (!isNullableType(dateTimeUndefined.type))
      fail(`"dateTimeUndefined" is not nullable`)
    if (!isScalarType(dateTimeUndefined.type))
      fail(`"dateTimeUndefined" is not scalar`)
    expect(dateTimeUndefined.type.name).toBe("DateTime")

    const dateTimeNullable = postInput.getFields()["dateTimeNullable"]
    expect(dateTimeNullable).not.toBe(undefined)
    if (!isNullableType(dateTimeNullable.type))
      fail(`"dateTimeNullable" is not nullable`)
    if (!isScalarType(dateTimeNullable.type))
      fail(`"dateTimeNullable" is not scalar`)
    expect(dateTimeNullable.type.name).toBe("DateTime")

    // ------------------------------------------------

    const time = postInput.getFields()["time"]
    expect(time).not.toBe(undefined)
    if (!isNonNullType(time.type)) fail(`"time" is nullable`)
    expect(isScalarType(time.type.ofType)).toBe(true)
    expect(time.type.ofType.name).toBe("Time")

    const timeUndefined = postInput.getFields()["timeUndefined"]
    expect(timeUndefined).not.toBe(undefined)
    if (!isNullableType(timeUndefined.type))
      fail(`"timeUndefined" is not nullable`)
    if (!isScalarType(timeUndefined.type)) fail(`"timeUndefined" is not scalar`)
    expect(timeUndefined.type.name).toBe("Time")

    const timeNullable = postInput.getFields()["timeNullable"]
    expect(timeNullable).not.toBe(undefined)
    if (!isNullableType(timeNullable.type))
      fail(`"timeNullable" is not nullable`)
    if (!isScalarType(timeNullable.type)) fail(`"timeNullable" is not scalar`)
    expect(timeNullable.type.name).toBe("Time")
  })
})
