import { parse } from "@microframework/parser"
import {
  buildGraphQLSchema,
  DefaultNamingStrategy,
} from "@microframework/graphql"
import {
  GraphQLField,
  GraphQLSchema,
  isListType,
  isNonNullType,
  isNullableType,
  isObjectType,
  isScalarType,
} from "graphql"
import * as GraphQL from "graphql"

describe("graphql > schema builder", () => {
  test("model (referenced type) with scalar properties", () => {
    const appMetadata = parse(__dirname + "/reference-model-scalars-app.ts")
    const schema = new GraphQLSchema(
      buildGraphQLSchema({
        graphql: GraphQL,
        appMetadata: appMetadata,
        namingStrategy: DefaultNamingStrategy,
        resolveFactory: () => undefined,
        subscribeFactory: () => undefined,
      }),
    )
    if (!schema) fail("Schema built failed")

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

    const numberArray = postType.getFields()["numberArray"]
    expect(numberArray).not.toBe(undefined)
    if (!isNonNullType(numberArray.type)) fail(`"number" is nullable`)
    expect(isListType(numberArray.type.ofType)).toBe(true)
    expect(isScalarType(numberArray.type.ofType.ofType)).toBe(true)
    expect(numberArray.type.ofType.ofType.name).toBe("Int")

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

    // ------------------------------------------------

    const string = postType.getFields()["string"]
    expect(string).not.toBe(undefined)
    if (!isNonNullType(string.type)) fail(`"string" is nullable`)
    expect(isScalarType(string.type.ofType)).toBe(true)
    expect(string.type.ofType.name).toBe("String")

    const stringArray = postType.getFields()["stringArray"]
    expect(stringArray).not.toBe(undefined)
    if (!isNonNullType(stringArray.type)) fail(`"stringArray" is nullable`)
    expect(isListType(stringArray.type.ofType)).toBe(true)
    expect(isScalarType(stringArray.type.ofType.ofType)).toBe(true)
    expect(stringArray.type.ofType.ofType.name).toBe("String")

    const stringUndefined = postType.getFields()["stringUndefined"]
    expect(stringUndefined).not.toBe(undefined)
    if (!isNullableType(stringUndefined.type))
      fail(`"stringUndefined" is not nullable`)
    if (!isScalarType(stringUndefined.type))
      fail(`"stringUndefined" is not scalar`)
    expect(stringUndefined.type.name).toBe("String")

    const stringNullable = postType.getFields()["stringNullable"]
    expect(stringNullable).not.toBe(undefined)
    if (!isNullableType(stringNullable.type))
      fail(`"stringNullable" is not nullable`)
    if (!isScalarType(stringNullable.type))
      fail(`"stringNullable" is not scalar`)
    expect(stringNullable.type.name).toBe("String")

    // ------------------------------------------------

    const boolean = postType.getFields()["boolean"]
    expect(boolean).not.toBe(undefined)
    if (!isNonNullType(boolean.type)) fail(`"boolean" is nullable`)
    expect(isScalarType(boolean.type.ofType)).toBe(true)
    expect(boolean.type.ofType.name).toBe("Boolean")

    const booleanArray = postType.getFields()["booleanArray"]
    expect(booleanArray).not.toBe(undefined)
    if (!isNonNullType(booleanArray.type)) fail(`"booleanArray" is nullable`)
    expect(isListType(booleanArray.type.ofType)).toBe(true)
    expect(isScalarType(booleanArray.type.ofType.ofType)).toBe(true)
    expect(booleanArray.type.ofType.ofType.name).toBe("Boolean")

    const booleanUndefined = postType.getFields()["booleanUndefined"]
    expect(booleanUndefined).not.toBe(undefined)
    if (!isNullableType(booleanUndefined.type))
      fail(`"booleanUndefined" is not nullable`)
    if (!isScalarType(booleanUndefined.type))
      fail(`"booleanUndefined" is not scalar`)
    expect(booleanUndefined.type.name).toBe("Boolean")

    const booleanNullable = postType.getFields()["booleanNullable"]
    expect(booleanNullable).not.toBe(undefined)
    if (!isNullableType(booleanNullable.type))
      fail(`"booleanNullable" is not nullable`)
    if (!isScalarType(booleanNullable.type))
      fail(`"booleanNullable" is not scalar`)
    expect(booleanNullable.type.name).toBe("Boolean")

    // ------------------------------------------------

    const float = postType.getFields()["float"]
    expect(float).not.toBe(undefined)
    if (!isNonNullType(float.type)) fail(`"float" is nullable`)
    expect(isScalarType(float.type.ofType)).toBe(true)
    expect(float.type.ofType.name).toBe("Float")

    const floatArray = postType.getFields()["floatArray"]
    expect(floatArray).not.toBe(undefined)
    if (!isNonNullType(floatArray.type)) fail(`"floatArray" is nullable`)
    expect(isListType(floatArray.type.ofType)).toBe(true)
    expect(isScalarType(floatArray.type.ofType.ofType)).toBe(true)
    expect(floatArray.type.ofType.ofType.name).toBe("Float")

    const floatUndefined = postType.getFields()["floatUndefined"]
    expect(floatUndefined).not.toBe(undefined)
    if (!isNullableType(floatUndefined.type))
      fail(`"floatUndefined" is not nullable`)
    if (!isScalarType(floatUndefined.type))
      fail(`"floatUndefined" is not scalar`)
    expect(floatUndefined.type.name).toBe("Float")

    const floatNullable = postType.getFields()["floatNullable"]
    expect(floatNullable).not.toBe(undefined)
    if (!isNullableType(floatNullable.type))
      fail(`"floatNullable" is not nullable`)
    if (!isScalarType(floatNullable.type)) fail(`"floatNullable" is not scalar`)
    expect(floatNullable.type.name).toBe("Float")

    // ------------------------------------------------

    const bigint = postType.getFields()["bigint"]
    expect(bigint).not.toBe(undefined)
    if (!isNonNullType(bigint.type)) fail(`"bigint" is nullable`)
    expect(isScalarType(bigint.type.ofType)).toBe(true)
    expect(bigint.type.ofType.name).toBe("BigInt")

    const bigintArray = postType.getFields()["bigintArray"]
    expect(bigintArray).not.toBe(undefined)
    if (!isNonNullType(bigintArray.type)) fail(`"bigintArray" is nullable`)
    expect(isListType(bigintArray.type.ofType)).toBe(true)
    expect(isScalarType(bigintArray.type.ofType.ofType)).toBe(true)
    expect(bigintArray.type.ofType.ofType.name).toBe("BigInt")

    const bigintUndefined = postType.getFields()["bigintUndefined"]
    expect(bigintUndefined).not.toBe(undefined)
    if (!isNullableType(bigintUndefined.type))
      fail(`"bigintUndefined" is not nullable`)
    if (!isScalarType(bigintUndefined.type))
      fail(`"bigintUndefined" is not scalar`)
    expect(bigintUndefined.type.name).toBe("BigInt")

    const bigintNullable = postType.getFields()["bigintNullable"]
    expect(bigintNullable).not.toBe(undefined)
    if (!isNullableType(bigintNullable.type))
      fail(`"bigintNullable" is not nullable`)
    if (!isScalarType(bigintNullable.type))
      fail(`"bigintNullable" is not scalar`)
    expect(bigintNullable.type.name).toBe("BigInt")

    // ------------------------------------------------

    const bigintObj = postType.getFields()["bigintObj"]
    expect(bigintObj).not.toBe(undefined)
    if (!isNonNullType(bigintObj.type)) fail(`"bigintObj" is nullable`)
    expect(isScalarType(bigintObj.type.ofType)).toBe(true)
    expect(bigintObj.type.ofType.name).toBe("BigInt")

    const bigintObjArray = postType.getFields()["bigintObjArray"]
    expect(bigintObjArray).not.toBe(undefined)
    if (!isNonNullType(bigintObjArray.type))
      fail(`"bigintObjArray" is nullable`)
    expect(isListType(bigintObjArray.type.ofType)).toBe(true)
    expect(isScalarType(bigintObjArray.type.ofType.ofType)).toBe(true)
    expect(bigintObjArray.type.ofType.ofType.name).toBe("BigInt")

    const bigintObjUndefined = postType.getFields()["bigintObjUndefined"]
    expect(bigintObjUndefined).not.toBe(undefined)
    if (!isNullableType(bigintObjUndefined.type))
      fail(`"bigintObjUndefined" is not nullable`)
    if (!isScalarType(bigintObjUndefined.type))
      fail(`"bigintObjUndefined" is not scalar`)
    expect(bigintObjUndefined.type.name).toBe("BigInt")

    const bigintObjNullable = postType.getFields()["bigintObjNullable"]
    expect(bigintObjNullable).not.toBe(undefined)
    if (!isNullableType(bigintObjNullable.type))
      fail(`"bigintObjNullable" is not nullable`)
    if (!isScalarType(bigintObjNullable.type))
      fail(`"bigintObjNullable" is not scalar`)
    expect(bigintObjNullable.type.name).toBe("BigInt")

    // ------------------------------------------------

    const date = postType.getFields()["date"]
    expect(date).not.toBe(undefined)
    if (!isNonNullType(date.type)) fail(`"date" is nullable`)
    expect(isScalarType(date.type.ofType)).toBe(true)
    expect(date.type.ofType.name).toBe("Date")

    const dateArray = postType.getFields()["dateArray"]
    expect(dateArray).not.toBe(undefined)
    if (!isNonNullType(dateArray.type)) fail(`"dateArray" is nullable`)
    expect(isListType(dateArray.type.ofType)).toBe(true)
    expect(isScalarType(dateArray.type.ofType.ofType)).toBe(true)
    expect(dateArray.type.ofType.ofType.name).toBe("Date")

    const dateUndefined = postType.getFields()["dateUndefined"]
    expect(dateUndefined).not.toBe(undefined)
    if (!isNullableType(dateUndefined.type))
      fail(`"dateUndefined" is not nullable`)
    if (!isScalarType(dateUndefined.type)) fail(`"dateUndefined" is not scalar`)
    expect(dateUndefined.type.name).toBe("Date")

    const dateNullable = postType.getFields()["dateNullable"]
    expect(dateNullable).not.toBe(undefined)
    if (!isNullableType(dateNullable.type))
      fail(`"dateNullable" is not nullable`)
    if (!isScalarType(dateNullable.type)) fail(`"dateNullable" is not scalar`)
    expect(dateNullable.type.name).toBe("Date")

    // ------------------------------------------------

    const dateTime = postType.getFields()["dateTime"]
    expect(dateTime).not.toBe(undefined)
    if (!isNonNullType(dateTime.type)) fail(`"dateTime" is nullable`)
    expect(isScalarType(dateTime.type.ofType)).toBe(true)
    expect(dateTime.type.ofType.name).toBe("DateTime")

    const dateTimeArray = postType.getFields()["dateTimeArray"]
    expect(dateTimeArray).not.toBe(undefined)
    if (!isNonNullType(dateTimeArray.type)) fail(`"dateTimeArray" is nullable`)
    expect(isListType(dateTimeArray.type.ofType)).toBe(true)
    expect(isScalarType(dateTimeArray.type.ofType.ofType)).toBe(true)
    expect(dateTimeArray.type.ofType.ofType.name).toBe("DateTime")

    const dateTimeUndefined = postType.getFields()["dateTimeUndefined"]
    expect(dateTimeUndefined).not.toBe(undefined)
    if (!isNullableType(dateTimeUndefined.type))
      fail(`"dateTimeUndefined" is not nullable`)
    if (!isScalarType(dateTimeUndefined.type))
      fail(`"dateTimeUndefined" is not scalar`)
    expect(dateTimeUndefined.type.name).toBe("DateTime")

    const dateTimeNullable = postType.getFields()["dateTimeNullable"]
    expect(dateTimeNullable).not.toBe(undefined)
    if (!isNullableType(dateTimeNullable.type))
      fail(`"dateTimeNullable" is not nullable`)
    if (!isScalarType(dateTimeNullable.type))
      fail(`"dateTimeNullable" is not scalar`)
    expect(dateTimeNullable.type.name).toBe("DateTime")

    // ------------------------------------------------

    const time = postType.getFields()["time"]
    expect(time).not.toBe(undefined)
    if (!isNonNullType(time.type)) fail(`"time" is nullable`)
    expect(isScalarType(time.type.ofType)).toBe(true)
    expect(time.type.ofType.name).toBe("Time")

    const timeArray = postType.getFields()["timeArray"]
    expect(timeArray).not.toBe(undefined)
    if (!isNonNullType(timeArray.type)) fail(`"timeArray" is nullable`)
    expect(isListType(timeArray.type.ofType)).toBe(true)
    expect(isScalarType(timeArray.type.ofType.ofType)).toBe(true)
    expect(timeArray.type.ofType.ofType.name).toBe("Time")

    const timeUndefined = postType.getFields()["timeUndefined"]
    expect(timeUndefined).not.toBe(undefined)
    if (!isNullableType(timeUndefined.type))
      fail(`"timeUndefined" is not nullable`)
    if (!isScalarType(timeUndefined.type)) fail(`"timeUndefined" is not scalar`)
    expect(timeUndefined.type.name).toBe("Time")

    const timeNullable = postType.getFields()["timeNullable"]
    expect(timeNullable).not.toBe(undefined)
    if (!isNullableType(timeNullable.type))
      fail(`"timeNullable" is not nullable`)
    if (!isScalarType(timeNullable.type)) fail(`"timeNullable" is not scalar`)
    expect(timeNullable.type.name).toBe("Time")

    // ------------------------------------------------

    const postTypeDeprecated = schema.getType("PostTypeDeprecated")
    expect(postTypeDeprecated).not.toBe(undefined)
    if (!isObjectType(postTypeDeprecated))
      fail("PostTypeDeprecated is not an object")
    expect(postTypeDeprecated.name).toBe("PostTypeDeprecated")
    expect(postTypeDeprecated.description).toBe("This type is deprecated.")

    const id = postTypeDeprecated.getFields()["id"]
    expect(id.deprecationReason).toBe(" ")

    const name = postTypeDeprecated.getFields()["name"]
    expect(name.description).toBe("This property is deprecated")
    expect(name.deprecationReason).toBe("Does not need anymore")
  })
})
