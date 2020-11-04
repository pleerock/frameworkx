import { createApp, ModelWithArgs, Float } from "@microframework/core"

export const App = createApp<{
  models: {
    PostModel: PostModel
    PersonComplexType: PersonComplexType
  }
}>()

/**
 * Simple model for testing purposes.
 */
export type PostModel = ModelWithArgs<PostType, PostArgs>

/**
 * Type for a PostModel.
 */
export type PostType = {
  id: number
  name: string
}

/**
 * Args for a PostModel.
 */
export type PostArgs = {
  name: {
    keyword: string
  }
}

/**
 * Complex type support test.
 */
export type PersonComplexType = {
  id: number
  firstName: string
  lastName: string
  alternativeNames: string[]
  age: number
  isActive: boolean
  career: {
    organization: {
      name: string
      description: string
    }
    position: string
  }
  educations: {
    name: string
    from: number
    to: number
    degree: string
  }[]
  mainPhoto: PhotoInterface
  photos: PhotoInterface[]
  posts: PostModel[]

  rating: Float
  status: StatusEnum
  // statusLiteral: "active" | "inactive"
  // statusNumberLiteral: 1 | 2
}

/**
 * This way we are testing interface support.
 */
export interface PhotoInterface {
  id: number
  filename: string
}

export enum StatusEnum {
  active = "active",
  inactive = "inactive",
}
