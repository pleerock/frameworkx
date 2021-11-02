import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostType
    QuestionType: {
      id: number
      names: string[]
      categories: CategoryType[]
    }
    QuestionAnswerType: QuestionAnswerType
    PostCategoryType: {
      posts: PostType[]
      categories: (CategoryType & CountersType)[]
    }
  }
  inputs: {
    PostInput: PostInput
    CategoryInput: CategoryInput
  }
  queries: {
    post(args: PostInput): PostType
    posts(args: { posts: PostInput[] }): PostType[]
    categories(args: {
      categories: (CategoryInput & CountersType)[]
    }): (CategoryType & CountersType)[]
  }
  mutations: {
    postSave(args: PostInput): PostType
    postsSave(args: { posts: PostInput[] }): PostType[]
    categoriesSave(args: {
      categories: (CategoryInput & CountersType)[]
    }): (CategoryType & CountersType)[]
  }
  subscriptions: {
    onPostSave(args: PostInput): PostType
    onPostsSave(args: { posts: PostInput[] }): PostType[]
    onCategoriesSave(args: {
      categories: (CategoryInput & CountersType)[]
    }): (CategoryType & CountersType)[]
  }
  actions: {}
  context: {}
}>()

// ------------------------------------------------

type PostType = {
  id: number
  tags: string[]
  watches: boolean[]
  categories: CategoryType[]
  statuses: StatusEnum[]
}

class CategoryType {
  id!: number
  names!: string[]
  posts!: PostType[]
}

type CountersType = typeof CountersCls

const CountersCls = class {
  votes: bigint[] = []
  comments: number[] = []
}

type QuestionAnswerType = {
  id: string
  answers: (AnswerType & CountersType)[] | undefined
}

interface AnswerType {
  text: string
}

// ------------------------------------------------

type PostInput = {
  id: number
  tags: string[]
  watches: boolean[]
  categories: CategoryInput[]
  statuses: StatusEnum[]
}

class CategoryInput {
  id!: number
  names!: string[]
  posts!: PostInput[]
}

// ------------------------------------------------

enum StatusEnum {
  /**
   * Is on draft.
   */
  draft = "draft",

  /**
   * Is published.
   */
  published = "published",
}
