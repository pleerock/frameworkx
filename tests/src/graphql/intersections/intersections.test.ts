import { parse } from "@microframework/parser"
import {
  buildGraphQLSchema,
  DefaultNamingStrategy,
} from "@microframework/graphql"
import {
  isListType,
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
      expect(isListType(categories.type.ofType)).toBe(true)
      expect(categories.type.ofType.ofType.name).toBe("PostTypeCategoriesModel")

      const categoryFields = categories.type.ofType.ofType.getFields()

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

      const categoryPosts = categoryFields["posts"]
      expect(categoryPosts).not.toBe(undefined)
      if (!isNonNullType(categoryPosts.type))
        fail(`"categoryPosts" is nullable`)
      expect(isListType(categoryPosts.type.ofType)).toBe(true)
      expect(categoryPosts.type.ofType.ofType.name).toBe("PostType")

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

    test("intersections in models - case #2", () => {
      const categoryType = schema.getType("CategoryType")
      expect(categoryType).not.toBe(undefined)

      if (!isObjectType(categoryType))
        fail("CategoryType is not an object type")
      expect(categoryType.name).toBe("CategoryType")

      const fields = categoryType.getFields()

      // ------------------------------------------------

      const id = fields["id"]
      expect(id).not.toBe(undefined)
      if (!isNonNullType(id.type)) fail(`"id" is nullable`)
      expect(isScalarType(id.type.ofType)).toBe(true)
      expect(id.type.ofType.name).toBe("Int")

      // ------------------------------------------------

      const title = fields["title"]
      expect(title).not.toBe(undefined)
      if (!isNonNullType(title.type)) fail(`"title" is nullable`)
      expect(isScalarType(title.type.ofType)).toBe(true)
      expect(title.type.ofType.name).toBe("String")

      // ------------------------------------------------

      const posts = fields["posts"]
      expect(posts).not.toBe(undefined)
      if (!isNonNullType(posts.type)) fail(`"posts" is nullable`)
      expect(isListType(posts.type.ofType)).toBe(true)
      expect(posts.type.ofType.ofType.name).toBe("PostType")

      const postFields = posts.type.ofType.ofType.getFields()

      const postId = postFields["id"]
      expect(postId).not.toBe(undefined)
      if (!isNonNullType(postId.type)) fail(`"postId" is nullable`)
      expect(isScalarType(postId.type.ofType)).toBe(true)
      expect(postId.type.ofType.name).toBe("Int")

      const postTitle = postFields["title"]
      expect(postTitle).not.toBe(undefined)
      if (!isNullableType(postTitle.type)) fail(`"postTitle" is not nullable`)
      if (!isScalarType(postTitle.type)) fail(`"postTitle" is not nullable`)
      expect(postTitle.type.name).toBe("String")

      const postRating = postFields["rating"]
      expect(postRating).not.toBe(undefined)
      if (!isNullableType(postRating.type)) fail(`"postRating" is not nullable`)
      if (!isScalarType(postRating.type)) fail(`"postRating" is not nullable`)
      expect(postRating.type.name).toBe("Int")

      // ------------------------------------------------

      const rating = fields["rating"]
      expect(rating).not.toBe(undefined)
      if (!isNonNullType(rating.type)) fail(`"rating" is nullable`)
      expect(isScalarType(rating.type.ofType)).toBe(true)
      expect(rating.type.ofType.name).toBe("BigInt")
    })
  })
})
