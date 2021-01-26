import { parse } from "@microframework/parser"
import {
  buildGraphQLSchema,
  DefaultNamingStrategy,
} from "@microframework/graphql"
import * as GraphQL from "graphql"
import {
  assertValidSchema,
  GraphQLSchema,
  isEnumType,
  isInputObjectType,
  isListType,
  isNonNullType,
  isObjectType,
  isScalarType,
} from "graphql"
import { getRealTypes } from "../../util/test-common"

describe("graphql > schema builder", () => {
  describe("application defined with arrays", () => {
    const appMetadata = parse(__dirname + "/arrays-app.ts")
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
    assertValidSchema(schema)

    test("should properly create all GraphQL types", () => {
      const types = getRealTypes(
        Object.keys(schema.getTypeMap()).map((key) => key),
      )

      expect(types).toEqual([
        "PostType",
        "PostTypeCategoriesModel",
        "PostTypeStatusesEnum",
        "QuestionType",
        "QuestionTypeCategoriesModel",
        "QuestionAnswerType",
        "QuestionAnswerTypeAnswersModel",
        // "BigInt", // ?
        "PostCategoryType",
        "PostCategoryTypeCategoriesModel",
        "PostInput",
        "PostInputStatusesEnum",
        "CategoryInput",
        "CategoriesReturnModel",
        "CategoriesArgsCategoriesInput",
        "CategoriesSaveReturnModel",
        "CategoriesSaveArgsCategoriesInput",
        "OnCategoriesSaveReturnModel",
        "OnCategoriesSaveArgsCategoriesInput",
      ])
    })

    test("arrays in models - case #1", () => {
      const postType = schema.getType("PostType")
      expect(postType).not.toBe(undefined)

      if (!isObjectType(postType)) fail("PostType is not an object type")
      expect(postType.name).toBe("PostType")

      const fields = postType.getFields()

      // ------------------------------------------------

      const tags = fields["tags"]
      expect(tags).not.toBe(undefined)
      if (!isNonNullType(tags.type)) fail(`"tags" is nullable`)
      expect(isNonNullType(tags.type)).toBe(true)
      expect(isListType(tags.type.ofType)).toBe(true)
      expect(tags.type.ofType.ofType.name).toBe("String")

      // ------------------------------------------------

      const watches = fields["watches"]
      expect(watches).not.toBe(undefined)
      if (!isNonNullType(watches.type)) fail(`"watches" is nullable`)
      expect(isNonNullType(watches.type)).toBe(true)
      expect(isListType(watches.type.ofType)).toBe(true)
      expect(watches.type.ofType.ofType.name).toBe("Boolean")

      // ------------------------------------------------

      const categories = fields["categories"]
      expect(categories).not.toBe(undefined)
      if (!isNonNullType(categories.type)) fail(`"categories" is nullable`)
      expect(isNonNullType(categories.type)).toBe(true)
      expect(isListType(categories.type.ofType)).toBe(true)

      const categoryType = categories.type.ofType.ofType
      expect(categoryType.name).toBe("PostTypeCategoriesModel")

      if (!isObjectType(categoryType)) fail(`"categories" is not an object`)
      const categoryFields = categoryType.getFields()

      const categoryNames = categoryFields["names"]
      expect(categoryNames).not.toBe(undefined)
      if (!isNonNullType(categoryNames.type))
        fail(`"categoryNames" is nullable`)
      expect(isNonNullType(categoryNames.type)).toBe(true)
      expect(isListType(categoryNames.type.ofType)).toBe(true)

      const categoryPosts = categoryFields["posts"]
      expect(categoryPosts).not.toBe(undefined)
      if (!isNonNullType(categoryPosts.type))
        fail(`"categoryPosts" is nullable`)
      expect(isNonNullType(categoryPosts.type)).toBe(true)

      expect(isListType(categoryPosts.type.ofType)).toBe(true)

      const categoryPostType = categoryPosts.type.ofType.ofType
      expect(categoryPostType.name).toBe("PostType")
      if (!isObjectType(categoryPostType)) fail(`"posts" is not an object`)

      // ------------------------------------------------

      const statuses = fields["statuses"]
      expect(statuses).not.toBe(undefined)
      if (!isNonNullType(statuses.type)) fail(`"statuses" is nullable`)
      expect(isNonNullType(statuses.type)).toBe(true)
      expect(isListType(statuses.type.ofType)).toBe(true)

      const statusEnum = statuses.type.ofType.ofType
      expect(statusEnum.name).toBe("PostTypeStatusesEnum")
      expect(isEnumType(statusEnum)).toBe(true)
    })

    test("arrays in models - case #2", () => {
      const questionType = schema.getType("QuestionType")
      expect(questionType).not.toBe(undefined)

      if (!isObjectType(questionType))
        fail("QuestionType is not an object type")
      expect(questionType.name).toBe("QuestionType")

      const fields = questionType.getFields()

      // ------------------------------------------------

      const names = fields["names"]
      expect(names).not.toBe(undefined)
      if (!isNonNullType(names.type)) fail(`"names" is nullable`)
      expect(isNonNullType(names.type)).toBe(true)
      expect(isListType(names.type.ofType)).toBe(true)

      // ------------------------------------------------

      const categories = fields["categories"]
      expect(categories).not.toBe(undefined)
      if (!isNonNullType(categories.type)) fail(`"categories" is nullable`)
      expect(isNonNullType(categories.type)).toBe(true)
      expect(isListType(categories.type.ofType)).toBe(true)

      const categoryType = categories.type.ofType.ofType
      expect(categoryType.name).toBe("QuestionTypeCategoriesModel")

      if (!isObjectType(categoryType)) fail(`"categories" is not an object`)
      const categoryFields = categoryType.getFields()

      const categoryNames = categoryFields["names"]
      expect(categoryNames).not.toBe(undefined)
      if (!isNonNullType(categoryNames.type))
        fail(`"categoryNames" is nullable`)
      expect(isNonNullType(categoryNames.type)).toBe(true)
      expect(isListType(categoryNames.type.ofType)).toBe(true)

      const categoryPosts = categoryFields["posts"]
      expect(categoryPosts).not.toBe(undefined)
      if (!isNonNullType(categoryPosts.type)) fail(`"posts" is nullable`)
      expect(isNonNullType(categoryPosts.type)).toBe(true)
      expect(isListType(categoryPosts.type.ofType)).toBe(true)
    })

    test("arrays in models - case #3", () => {
      const questionAnswerType = schema.getType("QuestionAnswerType")
      expect(questionAnswerType).not.toBe(undefined)

      if (!isObjectType(questionAnswerType))
        fail("QuestionAnswerType is not an object type")
      expect(questionAnswerType.name).toBe("QuestionAnswerType")

      const fields = questionAnswerType.getFields()

      // ------------------------------------------------

      const answers = fields["answers"]
      expect(answers).not.toBe(undefined)
      if (!isListType(answers.type)) fail(`"answers" is not list`)
      expect(answers.type.ofType.name).toBe("QuestionAnswerTypeAnswersModel")

      const votes = answers.type.ofType.getFields()["votes"]
      if (!isNonNullType(votes.type)) fail(`"votes" is nullable`)
      expect(isListType(votes.type.ofType)).toBe(true)
      expect(votes.type.ofType.ofType.name).toBe("BigInt")

      const comments = answers.type.ofType.getFields()["comments"]
      if (!isNonNullType(comments.type)) fail(`"comments" is nullable`)
      expect(isListType(comments.type.ofType)).toBe(true)
      expect(comments.type.ofType.ofType.name).toBe("Int")
    })

    test("arrays in models - case #4", () => {
      const postCategoryType = schema.getType("PostCategoryType")
      expect(postCategoryType).not.toBe(undefined)

      if (!isObjectType(postCategoryType))
        fail("PostCategoryType is not an object type")
      expect(postCategoryType.name).toBe("PostCategoryType")

      const fields = postCategoryType.getFields()

      // ------------------------------------------------

      const posts = fields["posts"]
      expect(posts).not.toBe(undefined)
      if (!isNonNullType(posts.type)) fail(`"posts" is nullable`)
      expect(isListType(posts.type.ofType)).toBe(true)
      expect(posts.type.ofType.ofType.name).toBe("PostType")

      const categories = fields["categories"]
      expect(categories).not.toBe(undefined)
      if (!isNonNullType(categories.type)) fail(`"categories" is nullable`)
      expect(isListType(categories.type.ofType)).toBe(true)

      const categoryType = categories.type.ofType.ofType
      expect(categoryType.name).toBe("PostCategoryTypeCategoriesModel")

      const categoryFields = categoryType.getFields()

      const names = categoryFields["names"]
      if (!isNonNullType(names.type)) fail(`"names" is nullable`)
      expect(isListType(names.type.ofType)).toBe(true)
      expect(isScalarType(names.type.ofType.ofType)).toBe(true)
      expect(names.type.ofType.ofType.name).toBe("String")

      const votes = categoryFields["votes"]
      if (!isNonNullType(votes.type)) fail(`"votes" is nullable`)
      expect(isListType(votes.type.ofType)).toBe(true)
      expect(isScalarType(votes.type.ofType.ofType)).toBe(true)
      expect(votes.type.ofType.ofType.name).toBe("BigInt")

      const comments = categoryFields["comments"]
      if (!isNonNullType(comments.type)) fail(`"comments" is nullable`)
      expect(isListType(comments.type.ofType)).toBe(true)
      expect(isScalarType(comments.type.ofType.ofType)).toBe(true)
      expect(comments.type.ofType.ofType.name).toBe("Int")
    })

    test("arrays in inputs", () => {
      const postInput = schema.getType("PostInput")
      expect(postInput).not.toBe(undefined)

      if (!isInputObjectType(postInput)) fail("PostInput is not an object type")
      expect(postInput.name).toBe("PostInput")

      const fields = postInput.getFields()

      // ------------------------------------------------

      const tags = fields["tags"]
      expect(tags).not.toBe(undefined)
      if (!isNonNullType(tags.type)) fail(`"tags" is nullable`)
      expect(isNonNullType(tags.type)).toBe(true)
      expect(isListType(tags.type.ofType)).toBe(true)
      expect(tags.type.ofType.ofType.name).toBe("String")

      // ------------------------------------------------

      const watches = fields["watches"]
      expect(watches).not.toBe(undefined)
      if (!isNonNullType(watches.type)) fail(`"watches" is nullable`)
      expect(isListType(watches.type.ofType)).toBe(true)
      expect(isScalarType(watches.type.ofType.ofType)).toBe(true)
      expect(watches.type.ofType.ofType.name).toBe("Boolean")

      // ------------------------------------------------

      const categories = fields["categories"]
      expect(categories).not.toBe(undefined)
      if (!isNonNullType(categories.type)) fail(`"categories" is nullable`)
      expect(isNonNullType(categories.type)).toBe(true)
      expect(isListType(categories.type.ofType)).toBe(true)

      const categoryInput = categories.type.ofType.ofType
      expect(categoryInput.name).toBe("CategoryInput")

      if (!isInputObjectType(categoryInput))
        fail(`"categories" is not an object`)
      const categoryFields = categoryInput.getFields()

      const categoryNames = categoryFields["names"]
      expect(categoryNames).not.toBe(undefined)
      if (!isNonNullType(categoryNames.type))
        fail(`"categoryNames" is nullable`)
      expect(isNonNullType(categoryNames.type)).toBe(true)
      expect(isListType(categoryNames.type.ofType)).toBe(true)

      const categoryPosts = categoryFields["posts"]
      expect(categoryPosts).not.toBe(undefined)
      if (!isNonNullType(categoryPosts.type))
        fail(`"categoryPosts" is nullable`)
      expect(isNonNullType(categoryPosts.type)).toBe(true)

      expect(isListType(categoryPosts.type.ofType)).toBe(true)

      const categoryPostType = categoryPosts.type.ofType.ofType
      expect(categoryPostType.name).toBe("PostInput")
      if (!isInputObjectType(categoryPostType)) fail(`"posts" is not an object`)

      // ------------------------------------------------

      const statuses = fields["statuses"]
      expect(statuses).not.toBe(undefined)
      if (!isNonNullType(statuses.type)) fail(`"statuses" is nullable`)
      expect(isNonNullType(statuses.type)).toBe(true)
      expect(isListType(statuses.type.ofType)).toBe(true)

      const statusEnum = statuses.type.ofType.ofType
      expect(statusEnum.name).toBe("PostInputStatusesEnum")
      expect(isEnumType(statusEnum)).toBe(true)
    })

    test("arrays in queries - case #1", () => {
      const query = schema.getQueryType()
      expect(query).not.toBe(undefined)

      const postField = query!.getFields()["post"]
      if (!isNonNullType(postField.type)) fail("PostType is nullable")
      expect(postField.type.ofType.name).toBe("PostType")
      expect(postField.args.length).toBe(5)

      // ------------------------------------------------

      const tags = postField.args.find((it) => it.name === "tags")
      expect(tags).not.toBe(undefined)

      if (!isNonNullType(tags!.type)) fail(`"tags" is nullable`)
      expect(isListType(tags!.type.ofType)).toBe(true)
      expect(isScalarType(tags!.type.ofType.ofType)).toBe(true)
      expect(tags!.type.ofType.ofType.name).toBe("String")

      // ------------------------------------------------

      const watches = postField.args.find((it) => it.name === "watches")
      expect(watches).not.toBe(undefined)

      if (!isNonNullType(watches!.type)) fail(`"watches" is nullable`)
      expect(isListType(watches!.type.ofType)).toBe(true)
      expect(isScalarType(watches!.type.ofType.ofType)).toBe(true)
      expect(watches!.type.ofType.ofType.name).toBe("Boolean")

      // ------------------------------------------------

      const categories = postField.args.find((it) => it.name === "categories")
      expect(categories).not.toBe(undefined)

      if (!isNonNullType(categories!.type)) fail(`"categories" is nullable`)
      expect(isListType(categories!.type.ofType)).toBe(true)
      expect(isInputObjectType(categories!.type.ofType.ofType)).toBe(true)
      expect(categories!.type.ofType.ofType.name).toBe("CategoryInput")

      // ------------------------------------------------

      const statuses = postField.args.find((it) => it.name === "statuses")
      expect(statuses).not.toBe(undefined)

      if (!isNonNullType(statuses!.type)) fail(`"statuses" is nullable`)
      expect(isListType(statuses!.type.ofType)).toBe(true)
      expect(isEnumType(statuses!.type.ofType.ofType)).toBe(true)
      expect(statuses!.type.ofType.ofType.name).toBe("PostInputStatusesEnum")
    })

    test("arrays in queries - case #2", () => {
      const query = schema.getQueryType()
      expect(query).not.toBe(undefined)

      const postsField = query!.getFields()["posts"]
      if (!isNonNullType(postsField.type)) fail("PostType is nullable")
      expect(isListType(postsField.type.ofType)).toBe(true)
      expect(isObjectType(postsField.type.ofType.ofType)).toBe(true)
      expect(postsField.type.ofType.ofType.name).toBe("PostType")
      expect(postsField.args.length).toBe(1)

      // ------------------------------------------------

      const posts = postsField.args.find((it) => it.name === "posts")
      expect(posts).not.toBe(undefined)

      if (!isNonNullType(posts!.type)) fail(`"posts" is nullable`)
      expect(isListType(posts!.type.ofType)).toBe(true)
      expect(isInputObjectType(posts!.type.ofType.ofType)).toBe(true)
      expect(posts!.type.ofType.ofType.name).toBe("PostInput")
    })

    test("arrays in queries - case #3", () => {
      const query = schema.getQueryType()
      expect(query).not.toBe(undefined)

      const categoriesField = query!.getFields()["categories"]
      if (!isNonNullType(categoriesField.type)) fail("CategoryType is nullable")
      expect(isListType(categoriesField.type.ofType)).toBe(true)
      expect(isObjectType(categoriesField.type.ofType.ofType)).toBe(true)
      expect(categoriesField.type.ofType.ofType.name).toBe(
        "CategoriesReturnModel",
      )
      expect(categoriesField.args.length).toBe(1)

      // ------------------------------------------------

      const categories = categoriesField.args.find(
        (it) => it.name === "categories",
      )
      expect(categories).not.toBe(undefined)

      if (!isNonNullType(categories!.type)) fail(`"categories" is nullable`)
      expect(isListType(categories!.type.ofType)).toBe(true)
      expect(isInputObjectType(categories!.type.ofType.ofType)).toBe(true)
      expect(categories!.type.ofType.ofType.name).toBe(
        "CategoriesArgsCategoriesInput",
      )

      const categoryFields = categories!.type.ofType.ofType.getFields()

      const names = categoryFields["names"]
      if (!isNonNullType(names.type)) fail(`"names" is nullable`)
      expect(isListType(names.type.ofType)).toBe(true)
      expect(isScalarType(names.type.ofType.ofType)).toBe(true)
      expect(names.type.ofType.ofType.name).toBe("String")

      const posts = categoryFields["posts"]
      if (!isNonNullType(posts.type)) fail(`"posts" is nullable`)
      expect(isListType(posts.type.ofType)).toBe(true)
      expect(isInputObjectType(posts.type.ofType.ofType)).toBe(true)
      expect(posts.type.ofType.ofType.name).toBe("PostInput")

      const votes = categoryFields["votes"]
      if (!isNonNullType(votes.type)) fail(`"votes" is nullable`)
      expect(isListType(votes.type.ofType)).toBe(true)
      expect(isScalarType(votes.type.ofType.ofType)).toBe(true)
      expect(votes.type.ofType.ofType.name).toBe("BigInt")

      const comments = categoryFields["comments"]
      if (!isNonNullType(comments.type)) fail(`"comments" is nullable`)
      expect(isListType(comments.type.ofType)).toBe(true)
      expect(isScalarType(comments.type.ofType.ofType)).toBe(true)
      expect(comments.type.ofType.ofType.name).toBe("Int")
    })

    test("arrays in mutations - case #1", () => {
      const mutation = schema.getMutationType()
      expect(mutation).not.toBe(undefined)

      const postSaveField = mutation!.getFields()["postSave"]
      if (!isNonNullType(postSaveField.type)) fail("PostType is nullable")
      expect(postSaveField.type.ofType.name).toBe("PostType")
      expect(postSaveField.args.length).toBe(5)

      // ------------------------------------------------

      const tags = postSaveField.args.find((it) => it.name === "tags")
      expect(tags).not.toBe(undefined)

      if (!isNonNullType(tags!.type)) fail(`"tags" is nullable`)
      expect(isListType(tags!.type.ofType)).toBe(true)
      expect(isScalarType(tags!.type.ofType.ofType)).toBe(true)
      expect(tags!.type.ofType.ofType.name).toBe("String")

      // ------------------------------------------------

      const watches = postSaveField.args.find((it) => it.name === "watches")
      expect(watches).not.toBe(undefined)

      if (!isNonNullType(watches!.type)) fail(`"watches" is nullable`)
      expect(isListType(watches!.type.ofType)).toBe(true)
      expect(isScalarType(watches!.type.ofType.ofType)).toBe(true)
      expect(watches!.type.ofType.ofType.name).toBe("Boolean")

      // ------------------------------------------------

      const categories = postSaveField.args.find(
        (it) => it.name === "categories",
      )
      expect(categories).not.toBe(undefined)

      if (!isNonNullType(categories!.type)) fail(`"categories" is nullable`)
      expect(isListType(categories!.type.ofType)).toBe(true)
      expect(isInputObjectType(categories!.type.ofType.ofType)).toBe(true)
      expect(categories!.type.ofType.ofType.name).toBe("CategoryInput")

      // ------------------------------------------------

      const statuses = postSaveField.args.find((it) => it.name === "statuses")
      expect(statuses).not.toBe(undefined)

      if (!isNonNullType(statuses!.type)) fail(`"statuses" is nullable`)
      expect(isListType(statuses!.type.ofType)).toBe(true)
      expect(isEnumType(statuses!.type.ofType.ofType)).toBe(true)
      expect(statuses!.type.ofType.ofType.name).toBe("PostInputStatusesEnum")
    })

    test("arrays in mutations - case #2", () => {
      const mutation = schema.getMutationType()
      expect(mutation).not.toBe(undefined)

      const postsSaveField = mutation!.getFields()["postsSave"]
      if (!isNonNullType(postsSaveField.type)) fail("PostType is nullable")
      expect(isListType(postsSaveField.type.ofType)).toBe(true)
      expect(isObjectType(postsSaveField.type.ofType.ofType)).toBe(true)
      expect(postsSaveField.type.ofType.ofType.name).toBe("PostType")
      expect(postsSaveField.args.length).toBe(1)

      // ------------------------------------------------

      const posts = postsSaveField.args.find((it) => it.name === "posts")
      expect(posts).not.toBe(undefined)

      if (!isNonNullType(posts!.type)) fail(`"posts" is nullable`)
      expect(isListType(posts!.type.ofType)).toBe(true)
      expect(isInputObjectType(posts!.type.ofType.ofType)).toBe(true)
      expect(posts!.type.ofType.ofType.name).toBe("PostInput")
    })

    test("arrays in mutations - case #3", () => {
      const mutation = schema.getMutationType()
      expect(mutation).not.toBe(undefined)

      const categoriesSaveField = mutation!.getFields()["categoriesSave"]
      if (!isNonNullType(categoriesSaveField.type))
        fail("CategoryType is nullable")
      expect(isListType(categoriesSaveField.type.ofType)).toBe(true)
      expect(isObjectType(categoriesSaveField.type.ofType.ofType)).toBe(true)
      expect(categoriesSaveField.type.ofType.ofType.name).toBe(
        "CategoriesSaveReturnModel",
      )
      expect(categoriesSaveField.args.length).toBe(1)

      // ------------------------------------------------

      const categories = categoriesSaveField.args.find(
        (it) => it.name === "categories",
      )
      expect(categories).not.toBe(undefined)

      if (!isNonNullType(categories!.type)) fail(`"categories" is nullable`)
      expect(isListType(categories!.type.ofType)).toBe(true)
      expect(isInputObjectType(categories!.type.ofType.ofType)).toBe(true)
      expect(categories!.type.ofType.ofType.name).toBe(
        "CategoriesSaveArgsCategoriesInput",
      )

      const categoryFields = categories!.type.ofType.ofType.getFields()

      const names = categoryFields["names"]
      if (!isNonNullType(names.type)) fail(`"names" is nullable`)
      expect(isListType(names.type.ofType)).toBe(true)
      expect(isScalarType(names.type.ofType.ofType)).toBe(true)
      expect(names.type.ofType.ofType.name).toBe("String")

      const posts = categoryFields["posts"]
      if (!isNonNullType(posts.type)) fail(`"posts" is nullable`)
      expect(isListType(posts.type.ofType)).toBe(true)
      expect(isInputObjectType(posts.type.ofType.ofType)).toBe(true)
      expect(posts.type.ofType.ofType.name).toBe("PostInput")

      const votes = categoryFields["votes"]
      if (!isNonNullType(votes.type)) fail(`"votes" is nullable`)
      expect(isListType(votes.type.ofType)).toBe(true)
      expect(isScalarType(votes.type.ofType.ofType)).toBe(true)
      expect(votes.type.ofType.ofType.name).toBe("BigInt")

      const comments = categoryFields["comments"]
      if (!isNonNullType(comments.type)) fail(`"comments" is nullable`)
      expect(isListType(comments.type.ofType)).toBe(true)
      expect(isScalarType(comments.type.ofType.ofType)).toBe(true)
      expect(comments.type.ofType.ofType.name).toBe("Int")
    })

    test("arrays in subscriptions - case #1", () => {
      const subscription = schema.getSubscriptionType()
      expect(subscription).not.toBe(undefined)

      const postSaveField = subscription!.getFields()["onPostSave"]
      if (!isNonNullType(postSaveField.type)) fail("PostType is nullable")
      expect(postSaveField.type.ofType.name).toBe("PostType")
      expect(postSaveField.args.length).toBe(5)

      // ------------------------------------------------

      const tags = postSaveField.args.find((it) => it.name === "tags")
      expect(tags).not.toBe(undefined)

      if (!isNonNullType(tags!.type)) fail(`"tags" is nullable`)
      expect(isListType(tags!.type.ofType)).toBe(true)
      expect(isScalarType(tags!.type.ofType.ofType)).toBe(true)
      expect(tags!.type.ofType.ofType.name).toBe("String")

      // ------------------------------------------------

      const watches = postSaveField.args.find((it) => it.name === "watches")
      expect(watches).not.toBe(undefined)

      if (!isNonNullType(watches!.type)) fail(`"watches" is nullable`)
      expect(isListType(watches!.type.ofType)).toBe(true)
      expect(isScalarType(watches!.type.ofType.ofType)).toBe(true)
      expect(watches!.type.ofType.ofType.name).toBe("Boolean")

      // ------------------------------------------------

      const categories = postSaveField.args.find(
        (it) => it.name === "categories",
      )
      expect(categories).not.toBe(undefined)

      if (!isNonNullType(categories!.type)) fail(`"categories" is nullable`)
      expect(isListType(categories!.type.ofType)).toBe(true)
      expect(isInputObjectType(categories!.type.ofType.ofType)).toBe(true)
      expect(categories!.type.ofType.ofType.name).toBe("CategoryInput")

      // ------------------------------------------------

      const statuses = postSaveField.args.find((it) => it.name === "statuses")
      expect(statuses).not.toBe(undefined)

      if (!isNonNullType(statuses!.type)) fail(`"statuses" is nullable`)
      expect(isListType(statuses!.type.ofType)).toBe(true)
      expect(isEnumType(statuses!.type.ofType.ofType)).toBe(true)
      expect(statuses!.type.ofType.ofType.name).toBe("PostInputStatusesEnum")
    })

    test("arrays in subscriptions - case #2", () => {
      const subscription = schema.getSubscriptionType()
      expect(subscription).not.toBe(undefined)

      const postsSaveField = subscription!.getFields()["onPostsSave"]
      if (!isNonNullType(postsSaveField.type)) fail("PostType is nullable")
      expect(isListType(postsSaveField.type.ofType)).toBe(true)
      expect(isObjectType(postsSaveField.type.ofType.ofType)).toBe(true)
      expect(postsSaveField.type.ofType.ofType.name).toBe("PostType")
      expect(postsSaveField.args.length).toBe(1)

      // ------------------------------------------------

      const posts = postsSaveField.args.find((it) => it.name === "posts")
      expect(posts).not.toBe(undefined)

      if (!isNonNullType(posts!.type)) fail(`"posts" is nullable`)
      expect(isListType(posts!.type.ofType)).toBe(true)
      expect(isInputObjectType(posts!.type.ofType.ofType)).toBe(true)
      expect(posts!.type.ofType.ofType.name).toBe("PostInput")
    })

    test("arrays in subscriptions - case #3", () => {
      const subscription = schema.getSubscriptionType()
      expect(subscription).not.toBe(undefined)

      const categoriesSaveField = subscription!.getFields()["onCategoriesSave"]
      if (!isNonNullType(categoriesSaveField.type))
        fail("CategoryType is nullable")
      expect(isListType(categoriesSaveField.type.ofType)).toBe(true)
      expect(isObjectType(categoriesSaveField.type.ofType.ofType)).toBe(true)
      expect(categoriesSaveField.type.ofType.ofType.name).toBe(
        "OnCategoriesSaveReturnModel",
      )
      expect(categoriesSaveField.args.length).toBe(1)

      // ------------------------------------------------

      const categories = categoriesSaveField.args.find(
        (it) => it.name === "categories",
      )
      expect(categories).not.toBe(undefined)

      if (!isNonNullType(categories!.type)) fail(`"categories" is nullable`)
      expect(isListType(categories!.type.ofType)).toBe(true)
      expect(isInputObjectType(categories!.type.ofType.ofType)).toBe(true)
      expect(categories!.type.ofType.ofType.name).toBe(
        "OnCategoriesSaveArgsCategoriesInput",
      )

      const categoryFields = categories!.type.ofType.ofType.getFields()

      const names = categoryFields["names"]
      if (!isNonNullType(names.type)) fail(`"names" is nullable`)
      expect(isListType(names.type.ofType)).toBe(true)
      expect(isScalarType(names.type.ofType.ofType)).toBe(true)
      expect(names.type.ofType.ofType.name).toBe("String")

      const posts = categoryFields["posts"]
      if (!isNonNullType(posts.type)) fail(`"posts" is nullable`)
      expect(isListType(posts.type.ofType)).toBe(true)
      expect(isInputObjectType(posts.type.ofType.ofType)).toBe(true)
      expect(posts.type.ofType.ofType.name).toBe("PostInput")

      const votes = categoryFields["votes"]
      if (!isNonNullType(votes.type)) fail(`"votes" is nullable`)
      expect(isListType(votes.type.ofType)).toBe(true)
      expect(isScalarType(votes.type.ofType.ofType)).toBe(true)
      expect(votes.type.ofType.ofType.name).toBe("BigInt")

      const comments = categoryFields["comments"]
      if (!isNonNullType(comments.type)) fail(`"comments" is nullable`)
      expect(isListType(comments.type.ofType)).toBe(true)
      expect(isScalarType(comments.type.ofType.ofType)).toBe(true)
      expect(comments.type.ofType.ofType.name).toBe("Int")
    })
  })
})
