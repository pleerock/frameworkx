import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostType
    CategoryType: CategoryGeneralType & CategoryMetaType
    PostCategoryType: {
      post: PostType
      category: CategoryGeneralType & CategoryMetaType
    }
    QuestionType: QuestionType & {
      /**
       * Is question answered.
       */
      isAnswered: boolean
    }
    AnswerType: { id: number } & { name: string } & {
      /**
       * Indicates if answer is accepted.
       * @deprecated not used anymore.
       */
      accepted: boolean
    }
  }
  inputs: {
    PostInput: PostInput
    CategoryInput: CategoryGeneralInput & CategoryMetaInput
    PostCategoryInput: {
      post: PostInput
      category: CategoryGeneralInput & CategoryMetaInput
    }
    QuestionInput: QuestionInput & {
      /**
       * Is question answered.
       */
      isAnswered: boolean
    }
    AnswerInput: { id: number } & { name: string } & {
      /**
       * Indicates if answer is accepted.
       * @deprecated not used anymore.
       */
      accepted: boolean
    }
  }
  queries: {
    post(args: PostInput): PostType
    posts(args: {
      post: PostInput & { isWatched: boolean }
    }): { post: PostType & { isWatched: boolean } }
    category(
      args: CategoryGeneralInput & CategoryMetaInput,
    ): CategoryGeneralType & CategoryMetaType
    question(
      args: QuestionInput & {
        /**
         * Is question answered.
         */
        isAnswered: boolean
      },
    ): QuestionType & { answer: string }
    answer(
      args: { id: number | undefined } & { name: string | null } & {
        accepted: boolean | null
      },
    ): { id: number | undefined } & { name: string | null } & {
      accepted: boolean | null
    }
  }
  mutations: {
    postSave(args: PostInput): PostType
    postsSave(args: {
      post: PostInput & { isWatched: boolean }
    }): { post: PostType & { isWatched: boolean } }
    categorySave(
      args: CategoryGeneralInput & CategoryMetaInput,
    ): CategoryGeneralType & CategoryMetaType
    questionSave(
      args: QuestionInput & {
        /**
         * Is question answered.
         */
        isAnswered: boolean
      },
    ): QuestionType & { answer: string }
    answerSave(
      args: { id: number | undefined } & { name: string | null } & {
        accepted: boolean | null
      },
    ): { id: number | undefined } & { name: string | null } & {
      accepted: boolean | null
    }
  }
  subscriptions: {
    onPostSave(args: PostInput): PostType
    onPostsSave(args: {
      post: PostInput & { isWatched: boolean }
    }): { post: PostType & { isWatched: boolean } }
    onCategorySave(
      args: CategoryGeneralInput & CategoryMetaInput,
    ): CategoryGeneralType & CategoryMetaType
    onQuestionSave(
      args: QuestionInput & { isWatched: boolean },
    ): QuestionType & { answer: string }
    onAnswerSave(
      args: { id: number | undefined } & { name: string | null } & {
        accepted: boolean | null
      },
    ): { id: number | undefined } & { name: string | null } & {
      accepted: boolean | null
    }
  }
}>()

// ------------------------------------------------

type PostType = PostGeneralType & PostMetaType
type QuestionType = QuestionGeneralType & QuestionMetaType

type PostGeneralType = {
  id: number
  title: string | undefined
  categories: (CategoryGeneralType & CategoryMetaType)[]
}

type PostMetaType = {
  /**
   * Post rating
   */
  rating: number | null
}

type CategoryGeneralType = {
  id: number
  title: string
  posts: PostType[]
}

type CategoryMetaType = {
  /**
   * Category rating
   * @deprecated not used anymore.
   */
  rating: bigint
}

type QuestionGeneralType = {
  id: number
  title: string
}

type QuestionMetaType = {
  rating: BigInt
}

// ------------------------------------------------

type PostInput = PostGeneralInput & PostMetaInput
type QuestionInput = QuestionGeneralInput & QuestionMetaInput

type PostGeneralInput = {
  id: number
  title: string | undefined
  categories: (CategoryGeneralInput & CategoryMetaInput)[]
}

type PostMetaInput = {
  rating: number | null
}

type CategoryGeneralInput = {
  id: number
  title: string
  post: PostInput
}

type CategoryMetaInput = {
  rating: number
}

type QuestionGeneralInput = {
  id: number
  title: string
}

type QuestionMetaInput = {
  rating: number
}
