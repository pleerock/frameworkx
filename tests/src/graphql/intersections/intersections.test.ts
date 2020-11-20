import { parse } from "@microframework/parser"
import {
  buildGraphQLSchema,
  DefaultNamingStrategy,
} from "@microframework/graphql"
import {
  isInputObjectType,
  isNonNullType,
  isNullableType,
  isObjectType,
  isScalarType,
} from "graphql"
import { getRealTypes } from "../../util/test-common"

describe("graphql > schema builder", () => {
  describe("application defined with intersections", () => {
    const appMetadata = parse(__dirname + "/intersections-app.ts")
    const schema = buildGraphQLSchema({
      assert: false,
      appMetadata: appMetadata,
      namingStrategy: DefaultNamingStrategy,
      resolveFactory: () => undefined,
      subscribeFactory: () => undefined,
    })
    if (!schema) fail("Schema built failed")

    test("should properly create all GraphQL types", () => {
      const types = getRealTypes(
        Object.keys(schema.getTypeMap()).map((key) => key),
      )

      expect(types).toEqual([
        "PostType",
        "PostTypeCategoriesModel",
        "CategoryType",
        "PostCategoryType",
        "PostCategoryTypeCategoryModel",
        "QuestionType",
        "AnswerType",
        "PostInput",
        "PostInputCategoriesInput",
        "CategoryInput",
        "PostCategoryInput",
        "PostCategoryInputCategoryInput",
        "QuestionInput",
        "AnswerInput",
        "PostsReturnModel",
        "PostsReturnPostModel",
        "PostsReturnPostCategoriesModel",
        "PostsArgsPostInput",
        "PostsArgsPostCategoriesInput",
        "CategoryReturnModel",
        "QuestionReturnModel",
        "AnswerReturnModel",
        "PostsSaveReturnModel",
        "PostsSaveReturnPostModel",
        "PostsSaveReturnPostCategoriesModel",
        "PostsSaveArgsPostInput",
        "PostsSaveArgsPostCategoriesInput",
        "CategorySaveReturnModel",
        "QuestionSaveReturnModel",
        "AnswerSaveReturnModel",
        "OnPostsSaveReturnModel",
        "OnPostsSaveReturnPostModel",
        "OnPostsSaveReturnPostCategoriesModel",
        "OnPostsSaveArgsPostInput",
        "OnPostsSaveArgsPostCategoriesInput",
        "OnCategorySaveReturnModel",
        "OnQuestionSaveReturnModel",
        "OnAnswerSaveReturnModel",
      ])
    })

    test("intersections in models - case #1", () => {
      const postType = schema.getType("PostType")
      expect(postType).not.toBe(undefined)

      if (!isObjectType(postType)) fail("PostType is not an object type")
      expect(postType.name).toBe("PostType")

      const fields = postType.getFields()

      // ------------------------------------------------

      const id = fields["id"]
      expect(id).not.toBe(undefined)
      if (!isNonNullType(id.type)) fail(`"id" is nullable`)
      expect(isScalarType(id.type.ofType)).toBe(true)
      expect(id.type.ofType.name).toBe("Int")

      // ------------------------------------------------

      const title = fields["title"]
      expect(title).not.toBe(undefined)
      if (!isNullableType(title.type)) fail(`"title" is not nullable`)
      if (!isScalarType(title.type)) fail(`"title" is not nullable`)
      expect(title.type.name).toBe("String")

      // ------------------------------------------------

      const categories = fields["categories"]
      expect(categories).not.toBe(undefined)
      if (!isNonNullType(categories.type)) fail(`"categories" is nullable`)
      expect(isObjectType(categories.type.ofType)).toBe(true)
      expect(categories.type.ofType.name).toBe("PostTypeCategoriesModel")

      const categoryFields = categories.type.ofType.getFields()

      const categoryId = categoryFields["id"]
      expect(categoryId).not.toBe(undefined)
      if (!isNonNullType(categoryId.type)) fail(`"categoryId" is nullable`)
      expect(isScalarType(categoryId.type.ofType)).toBe(true)
      expect(categoryId.type.ofType.name).toBe("Int")

      const categoryTitle = categoryFields["title"]
      expect(categoryTitle).not.toBe(undefined)
      if (!isNonNullType(categoryTitle.type))
        fail(`"categoryTitle" is nullable`)
      expect(isScalarType(categoryTitle.type.ofType)).toBe(true)
      expect(categoryTitle.type.ofType.name).toBe("String")

      const categoryPost = categoryFields["post"]
      expect(categoryPost).not.toBe(undefined)
      if (!isNonNullType(categoryPost.type)) fail(`"categoryPost" is nullable`)
      expect(isObjectType(categoryPost.type.ofType)).toBe(true)
      expect(categoryPost.type.ofType.name).toBe("PostType")

      const categoryRating = categoryFields["rating"]
      expect(categoryRating).not.toBe(undefined)
      if (!isNonNullType(categoryRating.type))
        fail(`"categoryRating" is nullable`)
      expect(isScalarType(categoryRating.type.ofType)).toBe(true)
      expect(categoryRating.type.ofType.name).toBe("BigInt")

      // ------------------------------------------------

      const rating = fields["rating"]
      expect(rating).not.toBe(undefined)
      if (!isNullableType(rating.type)) fail(`"rating" is not nullable`)
      if (!isScalarType(rating.type)) fail(`"rating" is not nullable`)
      expect(rating.type.name).toBe("Int")
    })
  })
})
