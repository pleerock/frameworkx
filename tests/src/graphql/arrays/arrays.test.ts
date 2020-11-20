import { parse } from "@microframework/parser"
import {
  buildGraphQLSchema,
  DefaultNamingStrategy,
} from "@microframework/graphql"
import { isEnumType, isListType, isNonNullType, isObjectType } from "graphql"
import { getRealTypes } from "../../util/test-common"

describe("graphql > schema builder", () => {
  describe("app types defined with arrays", () => {
    const appMetadata = parse(__dirname + "/arrays-app.ts")
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
        "PostTypeStatusesEnum",
        "QuestionType",
        "QuestionTypeCategoriesModel",
        "QuestionAnswerType",
        "QuestionAnswerTypeAnswersModel",
        "BigInt",
        "PostCategoryType",
        "PostCategoryTypeCategoriesModel",
        "PostInput",
        "PostInputStatusesEnum",
        "CategoryInput",
        "CategoriesReturnModel",
        "CategoriesArgsCategoriesInput",
        "CategoriesSaveReturnModel",
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
      expect(names.type.ofType.ofType.name).toBe("String")

      const votes = categoryFields["votes"]
      if (!isNonNullType(votes.type)) fail(`"votes" is nullable`)
      expect(isListType(votes.type.ofType)).toBe(true)
      expect(votes.type.ofType.ofType.name).toBe("BigInt")

      const comments = categoryFields["comments"]
      if (!isNonNullType(comments.type)) fail(`"comments" is nullable`)
      expect(isListType(comments.type.ofType)).toBe(true)
      expect(comments.type.ofType.ofType.name).toBe("Int")
    })
  })
})
