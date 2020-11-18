import { parse } from "@microframework/parser"
import {
  buildGraphQLSchema,
  DefaultNamingStrategy,
} from "@microframework/graphql"
import {
  isEnumType,
  isInputObjectType,
  isNonNullType,
  isObjectType,
} from "graphql"
import { getRealTypes } from "../../util/test-common"

describe("graphql > schema builder", () => {
  const appMetadata = parse(__dirname + "/enums-app.ts")
  const schema = buildGraphQLSchema({
    assert: false,
    appMetadata: appMetadata,
    namingStrategy: DefaultNamingStrategy,
    resolveFactory: () => undefined,
    subscribeFactory: () => undefined,
  })
  if (!schema) fail("Schema built failed")

  const postType = schema.getType("PostType")
  const postTypeStatusEnum = schema.getType("PostTypeStatusEnum")
  const postTypeCategoryEnum = schema.getType("PostTypeCategoryEnum")
  const postTypeTypeEnum = schema.getType("PostTypeTypeEnum")
  const questionType = schema.getType("QuestionType")
  const questionTypeStatusEnum = schema.getType("QuestionTypeStatusEnum")
  const questionTypeTypeEnum = schema.getType("QuestionTypeTypeEnum")
  const questionTypeCategoryEnum = schema.getType("QuestionTypeCategoryEnum")
  const postInput = schema.getType("PostInput")
  const postInputStatusEnum = schema.getType("PostInputStatusEnum")
  const postInputCategoryEnum = schema.getType("PostInputCategoryEnum")
  const postInputTypeEnum = schema.getType("PostInputTypeEnum")
  const questionInputStatusEnum = schema.getType("QuestionInputStatusEnum")
  const questionInputCategoryEnum = schema.getType("QuestionInputCategoryEnum")
  const questionInput = schema.getType("QuestionInput")
  const questionInputTypeEnum = schema.getType("QuestionInputTypeEnum")

  const types = getRealTypes(Object.keys(schema.getTypeMap()).map((key) => key))
  console.log(types)

  describe("model with referenced enum type", () => {
    test("should properly create all GraphQL types", () => {
      expect(types.length).toBe(28)

      expect(postType).not.toBe(undefined)
      if (!isObjectType(postType)) fail("PostType is not an object type")
      expect(postType.name).toBe("PostType")

      // ------------------------------------------------

      expect(postTypeStatusEnum).not.toBe(undefined)
      if (!isEnumType(postTypeStatusEnum))
        fail("PostTypeStatusEnum is not a enum type")
      expect(postTypeStatusEnum.name).toBe("PostTypeStatusEnum")

      // ------------------------------------------------

      expect(postTypeCategoryEnum).not.toBe(undefined)

      if (!isEnumType(postTypeCategoryEnum))
        fail("PostTypeCategoryEnum is not a enum type")
      expect(postTypeCategoryEnum.name).toBe("PostTypeCategoryEnum")

      // ------------------------------------------------

      expect(postTypeTypeEnum).not.toBe(undefined)
      if (!isEnumType(postTypeTypeEnum))
        fail("PostTypeTypeEnum is not a enum type")
      expect(postTypeTypeEnum.name).toBe("PostTypeTypeEnum")

      // ------------------------------------------------

      expect(questionType).not.toBe(undefined)
      if (!isObjectType(questionType))
        fail("QuestionType is not an object type")
      expect(questionType.name).toBe("QuestionType")

      // ------------------------------------------------

      expect(questionTypeStatusEnum).not.toBe(undefined)
      if (!isEnumType(questionTypeStatusEnum))
        fail("QuestionTypeStatusEnum is not a enum type")
      expect(questionTypeStatusEnum.name).toBe("QuestionTypeStatusEnum")

      // ------------------------------------------------

      expect(questionTypeCategoryEnum).not.toBe(undefined)
      if (!isEnumType(questionTypeCategoryEnum))
        fail("QuestionTypeCategoryEnum is not a enum type")
      expect(questionTypeCategoryEnum.name).toBe("QuestionTypeCategoryEnum")

      // ------------------------------------------------

      expect(questionTypeTypeEnum).not.toBe(undefined)

      if (!isEnumType(questionTypeTypeEnum))
        fail("QuestionTypeTypeEnum is not a enum type")
      expect(questionTypeTypeEnum.name).toBe("QuestionTypeTypeEnum")

      // ------------------------------------------------

      expect(postInput).not.toBe(undefined)

      if (!isInputObjectType(postInput))
        fail("PostInput is not an input object type")
      expect(postInput.name).toBe("PostInput")

      // ------------------------------------------------

      expect(postInputStatusEnum).not.toBe(undefined)

      if (!isEnumType(postInputStatusEnum))
        fail("PostInputStatusEnum is not a enum type")
      expect(postInputStatusEnum.name).toBe("PostInputStatusEnum")

      // ------------------------------------------------

      expect(postInputCategoryEnum).not.toBe(undefined)

      if (!isEnumType(postInputCategoryEnum))
        fail("PostInputCategoryEnum is not a enum type")
      expect(postInputCategoryEnum.name).toBe("PostInputCategoryEnum")

      // ------------------------------------------------

      expect(postInputTypeEnum).not.toBe(undefined)

      if (!isEnumType(postInputTypeEnum))
        fail("PostInputTypeEnum is not a enum type")
      expect(postInputTypeEnum.name).toBe("PostInputTypeEnum")

      // ------------------------------------------------

      expect(questionInput).not.toBe(undefined)

      if (!isInputObjectType(questionInput))
        fail("QuestionInput is not an input object type")
      expect(questionInput.name).toBe("QuestionInput")

      // ------------------------------------------------

      expect(questionInputStatusEnum).not.toBe(undefined)

      if (!isEnumType(questionInputStatusEnum))
        fail("QuestionInputStatusEnum is not a enum type")
      expect(questionInputStatusEnum.name).toBe("QuestionInputStatusEnum")

      // ------------------------------------------------

      expect(questionInputCategoryEnum).not.toBe(undefined)
      if (!isEnumType(questionInputCategoryEnum))
        fail("QuestionInputCategoryEnum is not a enum type")
      expect(questionInputCategoryEnum.name).toBe("QuestionInputCategoryEnum")

      // ------------------------------------------------

      expect(questionInputTypeEnum).not.toBe(undefined)
      if (!isEnumType(questionInputTypeEnum))
        fail("QuestionInputTypeEnum is not a enum type")
      expect(questionInputTypeEnum.name).toBe("QuestionInputTypeEnum")
    })

    test("model with referenced enum type", () => {
      const postType = schema.getType("PostType")
      if (!isObjectType(postType)) fail("PostType is not an object type")
      const fields = postType.getFields()
      console.log(fields)

      // ------------------------------------------------

      const status = fields["status"]
      expect(status).not.toBe(undefined)
      if (!isNonNullType(status.type)) fail("PostTypeStatusEnum is nullable")
      const statusEnum = status.type.ofType
      if (!isEnumType(statusEnum)) fail("PostTypeStatusEnum is not a enum type")

      expect(statusEnum.name).toBe("PostTypeStatusEnum")
      expect(statusEnum.getValues().length).toBe(4)

      expect(statusEnum.getValues()[0].name).toBe("draft")
      expect(statusEnum.getValues()[0].value).toBe("draft")
      expect(statusEnum.getValues()[0].description).toBe("Post is on draft.")

      expect(statusEnum.getValues()[1].name).toBe("published")
      expect(statusEnum.getValues()[1].value).toBe("published")
      expect(statusEnum.getValues()[1].description).toBe("Post is published.")

      expect(statusEnum.getValues()[2].name).toBe("removed")
      expect(statusEnum.getValues()[2].value).toBe("removed")
      expect(statusEnum.getValues()[2].description).toBe("Post is removed.")
      expect(statusEnum.getValues()[2].isDeprecated).toBe(true)
      expect(statusEnum.getValues()[2].deprecationReason).toBe(undefined)

      expect(statusEnum.getValues()[3].name).toBe("watched")
      expect(statusEnum.getValues()[3].value).toBe("watched")
      expect(statusEnum.getValues()[3].description).toBe("Post is watched.")
      expect(statusEnum.getValues()[3].isDeprecated).toBe(true)
      expect(statusEnum.getValues()[3].deprecationReason).toBe(
        "this status is not used anymore.",
      )

      // ------------------------------------------------

      const category = fields["category"]
      expect(category).not.toBe(undefined)
      if (!isNonNullType(category.type))
        fail("PostTypeCategoryEnum is nullable")
      const categoryEnum = category.type.ofType
      if (!isEnumType(categoryEnum))
        fail("PostTypeCategoryEnum is not a enum type")

      expect(categoryEnum.name).toBe("PostTypeCategoryEnum")
      expect(categoryEnum.getValues().length).toBe(2)

      expect(categoryEnum.getValues()[0].name).toBe("animals")
      expect(categoryEnum.getValues()[0].value).toBe("animals")

      expect(categoryEnum.getValues()[1].name).toBe("cars")
      expect(categoryEnum.getValues()[1].value).toBe("cars")

      // ------------------------------------------------

      const type = fields["type"]
      expect(type).not.toBe(undefined)
      if (!isNonNullType(type.type)) fail("PostTypeTypeEnum is nullable")
      const typeEnum = type.type.ofType
      if (!isEnumType(typeEnum)) fail("PostTypeTypeEnum is not a enum type")

      expect(typeEnum.name).toBe("PostTypeTypeEnum")
      expect(typeEnum.getValues().length).toBe(2)

      expect(typeEnum.getValues()[0].name).toBe("blog")
      expect(typeEnum.getValues()[0].value).toBe("blog")

      expect(typeEnum.getValues()[1].name).toBe("news")
      expect(typeEnum.getValues()[1].value).toBe("news")
    })
  })
})
