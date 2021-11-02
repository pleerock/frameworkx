import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    IdStrType: IdStrType
    IdNumType: IdNumType
    PostType: PostType
    QuestionType: {
      id: IdStrType | IdNumType
      category: CategoryType
      status: Status
    }
    CarType: { body: CarBodyType } & { wheels: WheelType[] }
  }
  inputs: {
    PostInput: PostInput
    QuestionInput: {
      category: CategoryInput
      status: Status
    }
    CarInput: { body: CarBodyInput } & { wheels: WheelInput[] }
  }
  queries: {}
  mutations: {}
  subscriptions: {}
  actions: {}
  context: {}
}>()

// ------------------------------------------------

type PostType = {
  id: IdStrType | IdNumType
  status: Status
  categories: CategoryType[]
}

type CategoryType = {
  id: IdStrType | IdNumType
  status: Status
  counters: CountersType
}

type CountersType = {
  id: IdStrType | IdNumType
  watches: number
}

type IdStrType = {
  id: string
}

type IdNumType = {
  id: number
}

type CarBodyType = {
  id: IdStrType | IdNumType
  status: Status
}

type WheelType = {
  category: CategoryType
}

enum Status {
  active = "active",
  disabled = "disabled",
}

// ------------------------------------------------

type PostInput = {
  status: Status
  categories: CategoryInput[]
}

type CategoryInput = {
  status: Status
  counters: CountersInput
}

type CountersInput = {
  watches: number
}

type CarBodyInput = {
  status: Status
}

type WheelInput = {
  category: CategoryInput
}
