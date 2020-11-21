import { parse } from "@microframework/parser"
import {
  buildGraphQLSchema,
  DefaultNamingStrategy,
} from "@microframework/graphql"
import {
  GraphQLField,
  isInputObjectType,
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
      expect(isObjectType(categories.type.ofType.ofType)).toBe(true)
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
      expect(isObjectType(categoryPosts.type.ofType.ofType)).toBe(true)
      expect(categoryPosts.type.ofType.ofType.name).toBe("PostType")

      const categoryRating = categoryFields["rating"]
      expect(categoryRating).not.toBe(undefined)
      expect(categoryRating.description).toBe("Category rating")
      expect(categoryRating.isDeprecated).toBe(true)
      expect(categoryRating.deprecationReason).toBe("not used anymore.")
      if (!isNonNullType(categoryRating.type))
        fail(`"categoryRating" is nullable`)
      expect(isScalarType(categoryRating.type.ofType)).toBe(true)
      expect(categoryRating.type.ofType.name).toBe("BigInt")

      // ------------------------------------------------

      const rating = fields["rating"]
      expect(rating).not.toBe(undefined)
      expect(rating.description).toBe("Post rating")
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
      expect(postRating.description).toBe("Post rating")
      if (!isNullableType(postRating.type)) fail(`"postRating" is not nullable`)
      if (!isScalarType(postRating.type)) fail(`"postRating" is not nullable`)
      expect(postRating.type.name).toBe("Int")

      // ------------------------------------------------

      const rating = fields["rating"]
      expect(rating).not.toBe(undefined)
      expect(rating.description).toBe("Category rating")
      expect((rating as GraphQLField<any, any>).isDeprecated).toBe(true)
      expect(rating.deprecationReason).toBe("not used anymore.")
      if (!isNonNullType(rating.type)) fail(`"rating" is nullable`)
      expect(isScalarType(rating.type.ofType)).toBe(true)
      expect(rating.type.ofType.name).toBe("BigInt")
    })

    test("intersections in models - case #3", () => {
      const postCategoryType = schema.getType("PostCategoryType")
      expect(postCategoryType).not.toBe(undefined)

      if (!isObjectType(postCategoryType))
        fail("PostCategoryType is not an object type")
      expect(postCategoryType.name).toBe("PostCategoryType")

      const fields = postCategoryType.getFields()

      // ------------------------------------------------

      const post = fields["post"]
      expect(post).not.toBe(undefined)
      if (!isNonNullType(post.type)) fail(`"post" is nullable`)
      expect(isObjectType(post.type.ofType)).toBe(true)
      expect(post.type.ofType.name).toBe("PostType")

      const postFields = post.type.ofType.getFields()

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
      expect(postRating.description).toBe("Post rating")
      if (!isNullableType(postRating.type)) fail(`"postRating" is not nullable`)
      if (!isScalarType(postRating.type)) fail(`"postRating" is not nullable`)
      expect(postRating.type.name).toBe("Int")

      // ------------------------------------------------

      const category = fields["category"]
      expect(category).not.toBe(undefined)
      if (!isNonNullType(category.type)) fail(`"category" is nullable`)
      expect(isObjectType(category.type.ofType)).toBe(true)
      expect(category.type.ofType.name).toBe("PostCategoryTypeCategoryModel")

      const categoryFields = category.type.ofType.getFields()

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
      expect(isObjectType(categoryPosts.type.ofType.ofType)).toBe(true)
      expect(categoryPosts.type.ofType.ofType.name).toBe("PostType")

      const categoryRating = categoryFields["rating"]
      expect(categoryRating).not.toBe(undefined)
      expect(categoryRating.description).toBe("Category rating")
      expect(categoryRating.isDeprecated).toBe(true)
      expect(categoryRating.deprecationReason).toBe("not used anymore.")
      if (!isNonNullType(categoryRating.type))
        fail(`"categoryRating" is nullable`)
      expect(isScalarType(categoryRating.type.ofType)).toBe(true)
      expect(categoryRating.type.ofType.name).toBe("BigInt")
    })

    test("intersections in models - case #4", () => {
      const questionType = schema.getType("QuestionType")
      expect(questionType).not.toBe(undefined)

      if (!isObjectType(questionType))
        fail("QuestionType is not an object type")
      expect(questionType.name).toBe("QuestionType")

      const fields = questionType.getFields()

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

      const rating = fields["rating"]
      expect(rating).not.toBe(undefined)
      if (!isNonNullType(rating.type)) fail(`"rating" is nullable`)
      expect(isScalarType(rating.type.ofType)).toBe(true)
      expect(rating.type.ofType.name).toBe("BigInt")

      // ------------------------------------------------

      const isAnswered = fields["isAnswered"]
      expect(isAnswered).not.toBe(undefined)
      expect(isAnswered.description).toBe("Is question answered.")
      if (!isNonNullType(isAnswered.type)) fail(`"isAnswered" is nullable`)
      expect(isScalarType(isAnswered.type.ofType)).toBe(true)
      expect(isAnswered.type.ofType.name).toBe("Boolean")
    })

    test("intersections in models - case #5", () => {
      const answerType = schema.getType("AnswerType")
      expect(answerType).not.toBe(undefined)

      if (!isObjectType(answerType)) fail("AnswerType is not an object type")
      expect(answerType.name).toBe("AnswerType")

      const fields = answerType.getFields()

      // ------------------------------------------------

      const id = fields["id"]
      expect(id).not.toBe(undefined)
      if (!isNonNullType(id.type)) fail(`"id" is nullable`)
      expect(isScalarType(id.type.ofType)).toBe(true)
      expect(id.type.ofType.name).toBe("Int")

      // ------------------------------------------------

      const name = fields["name"]
      expect(name).not.toBe(undefined)
      if (!isNonNullType(name.type)) fail(`"name" is nullable`)
      expect(isScalarType(name.type.ofType)).toBe(true)
      expect(name.type.ofType.name).toBe("String")

      // ------------------------------------------------

      const accepted = fields["accepted"]
      expect(accepted).not.toBe(undefined)
      expect(accepted.description).toBe("Indicates if answer is accepted.")
      expect((accepted as GraphQLField<any, any>).isDeprecated).toBe(true)
      expect(accepted.deprecationReason).toBe("not used anymore.")
      if (!isNonNullType(accepted.type)) fail(`"accepted" is nullable`)
      expect(isScalarType(accepted.type.ofType)).toBe(true)
      expect(accepted.type.ofType.name).toBe("Boolean")
    })

    test("intersections in inputs - case #1", () => {
      const postInput = schema.getType("PostInput")
      expect(postInput).not.toBe(undefined)

      if (!isInputObjectType(postInput)) fail("PostInput is not an object type")
      expect(postInput.name).toBe("PostInput")

      const fields = postInput.getFields()

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
      expect(isInputObjectType(categories.type.ofType.ofType)).toBe(true)
      expect(categories.type.ofType.ofType.name).toBe(
        "PostInputCategoriesInput",
      )

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
      expect(isInputObjectType(categoryPosts.type.ofType.ofType)).toBe(true)
      expect(categoryPosts.type.ofType.ofType.name).toBe("PostInput")

      const categoryRating = categoryFields["rating"]
      console.log(categoryRating)
      expect(categoryRating).not.toBe(undefined)
      expect(categoryRating.description).toBe("Category rating")
      expect(categoryRating.isDeprecated).toBe(true)
      expect(categoryRating.deprecationReason).toBe("not used anymore.")
      if (!isNonNullType(categoryRating.type))
        fail(`"categoryRating" is nullable`)
      expect(isScalarType(categoryRating.type.ofType)).toBe(true)
      expect(categoryRating.type.ofType.name).toBe("BigInt")

      // ------------------------------------------------

      const rating = fields["rating"]
      expect(rating).not.toBe(undefined)
      expect(rating.description).toBe("Post rating")
      if (!isNullableType(rating.type)) fail(`"rating" is not nullable`)
      if (!isScalarType(rating.type)) fail(`"rating" is not nullable`)
      expect(rating.type.name).toBe("Int")
    })

    test("intersections in inputs - case #2", () => {
      const categoryInput = schema.getType("CategoryInput")
      expect(categoryInput).not.toBe(undefined)

      if (!isInputObjectType(categoryInput))
        fail("CategoryInput is not an object type")
      expect(categoryInput.name).toBe("CategoryInput")

      const fields = categoryInput.getFields()

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
      expect(isInputObjectType(posts.type.ofType.ofType)).toBe(true)
      expect(posts.type.ofType.ofType.name).toBe("PostInput")

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
      expect(postRating.description).toBe("Post rating")
      if (!isNullableType(postRating.type)) fail(`"postRating" is not nullable`)
      if (!isScalarType(postRating.type)) fail(`"postRating" is not nullable`)
      expect(postRating.type.name).toBe("Int")

      // ------------------------------------------------

      const rating = fields["rating"]
      expect(rating).not.toBe(undefined)
      expect(rating.description).toBe("Category rating")
      expect((rating as GraphQLField<any, any>).isDeprecated).toBe(true)
      expect(rating.deprecationReason).toBe("not used anymore.")
      if (!isNonNullType(rating.type)) fail(`"rating" is nullable`)
      expect(isScalarType(rating.type.ofType)).toBe(true)
      expect(rating.type.ofType.name).toBe("BigInt")
    })

    test("intersections in inputs - case #3", () => {
      const postCategoryInput = schema.getType("PostCategoryInput")
      expect(postCategoryInput).not.toBe(undefined)

      if (!isInputObjectType(postCategoryInput))
        fail("PostCategoryInput is not an object type")
      expect(postCategoryInput.name).toBe("PostCategoryInput")

      const fields = postCategoryInput.getFields()

      // ------------------------------------------------

      const post = fields["post"]
      expect(post).not.toBe(undefined)
      if (!isNonNullType(post.type)) fail(`"post" is nullable`)
      expect(isInputObjectType(post.type.ofType)).toBe(true)
      expect(post.type.ofType.name).toBe("PostInput")

      const postFields = post.type.ofType.getFields()

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
      expect(postRating.description).toBe("Post rating")
      if (!isNullableType(postRating.type)) fail(`"postRating" is not nullable`)
      if (!isScalarType(postRating.type)) fail(`"postRating" is not nullable`)
      expect(postRating.type.name).toBe("Int")

      // ------------------------------------------------

      const category = fields["category"]
      expect(category).not.toBe(undefined)
      if (!isNonNullType(category.type)) fail(`"category" is nullable`)
      expect(isInputObjectType(category.type.ofType)).toBe(true)
      expect(category.type.ofType.name).toBe("PostCategoryInputCategoryInput")

      const categoryFields = category.type.ofType.getFields()

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
      expect(isInputObjectType(categoryPosts.type.ofType.ofType)).toBe(true)
      expect(categoryPosts.type.ofType.ofType.name).toBe("PostInput")

      const categoryRating = categoryFields["rating"]
      expect(categoryRating).not.toBe(undefined)
      expect(categoryRating.description).toBe("Category rating")
      expect(categoryRating.isDeprecated).toBe(true)
      expect(categoryRating.deprecationReason).toBe("not used anymore.")
      if (!isNonNullType(categoryRating.type))
        fail(`"categoryRating" is nullable`)
      expect(isScalarType(categoryRating.type.ofType)).toBe(true)
      expect(categoryRating.type.ofType.name).toBe("BigInt")
    })

    test("intersections in inputs - case #4", () => {
      const questionInput = schema.getType("QuestionInput")
      expect(questionInput).not.toBe(undefined)

      if (!isInputObjectType(questionInput))
        fail("QuestionInput is not an object type")
      expect(questionInput.name).toBe("QuestionInput")

      const fields = questionInput.getFields()

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

      const rating = fields["rating"]
      expect(rating).not.toBe(undefined)
      if (!isNonNullType(rating.type)) fail(`"rating" is nullable`)
      expect(isScalarType(rating.type.ofType)).toBe(true)
      expect(rating.type.ofType.name).toBe("BigInt")

      // ------------------------------------------------

      const isAnswered = fields["isAnswered"]
      expect(isAnswered).not.toBe(undefined)
      expect(isAnswered.description).toBe("Is question answered.")
      if (!isNonNullType(isAnswered.type)) fail(`"isAnswered" is nullable`)
      expect(isScalarType(isAnswered.type.ofType)).toBe(true)
      expect(isAnswered.type.ofType.name).toBe("Boolean")
    })

    test("intersections in inputs - case #5", () => {
      const answerInput = schema.getType("AnswerInput")
      expect(answerInput).not.toBe(undefined)

      if (!isInputObjectType(answerInput))
        fail("AnswerInput is not an object type")
      expect(answerInput.name).toBe("AnswerInput")

      const fields = answerInput.getFields()

      // ------------------------------------------------

      const id = fields["id"]
      expect(id).not.toBe(undefined)
      if (!isNonNullType(id.type)) fail(`"id" is nullable`)
      expect(isScalarType(id.type.ofType)).toBe(true)
      expect(id.type.ofType.name).toBe("Int")

      // ------------------------------------------------

      const name = fields["name"]
      expect(name).not.toBe(undefined)
      if (!isNonNullType(name.type)) fail(`"name" is nullable`)
      expect(isScalarType(name.type.ofType)).toBe(true)
      expect(name.type.ofType.name).toBe("String")

      // ------------------------------------------------

      const accepted = fields["accepted"]
      expect(accepted).not.toBe(undefined)
      expect(accepted.description).toBe("Indicates if answer is accepted.")
      expect((accepted as GraphQLField<any, any>).isDeprecated).toBe(true)
      expect(accepted.deprecationReason).toBe("not used anymore.")
      if (!isNonNullType(accepted.type)) fail(`"accepted" is nullable`)
      expect(isScalarType(accepted.type.ofType)).toBe(true)
      expect(accepted.type.ofType.name).toBe("Boolean")
    })
  })
})
