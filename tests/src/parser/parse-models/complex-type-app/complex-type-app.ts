import { createApp, ModelWithArgs, Float } from "@microframework/core"

export const App = createApp<{
  models: {
    PhotoInterface: PhotoInterface
    PostType: PostModel
    PersonComplexType: PersonComplexType
  }
}>()

/**
 * Simple model for testing purposes.
 */
type PostModel = ModelWithArgs<PostType, PostArgs>

/**
 * Type for a PostModel.
 */
type PostType = {
  id: number
  name: string
}

/**
 * Args for a PostModel.
 */
type PostArgs = {
  name: {
    keyword: string
  }
}

/**
 * Complex type support test.
 */
type PersonComplexType = {
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
  posts: PostType[]

  rating: Float
  status: StatusEnum
  // statusLiteral: "active" | "inactive"
  // statusNumberLiteral: 1 | 2
}

/**
 * This way we are testing interface support.
 */
interface PhotoInterface {
  id: number
  filename: string
}

enum StatusEnum {
  active = "active",
  inactive = "inactive",
}
