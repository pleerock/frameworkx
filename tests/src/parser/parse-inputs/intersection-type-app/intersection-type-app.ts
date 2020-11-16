import { createApp, ModelWithArgs } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostModel
  }
  inputs: {
    PersonIntersectionInputType: PersonIntersectionInputType
  }
}>()

/**
 * Simple model for testing purposes.
 */
type PostModel = ModelWithArgs<PostType, any>

/**
 * Type for a PostModel.
 */
type PostType = {
  id: number
  name: string
}

/**
 * This way we are testing intersection type.
 */
type PersonIntersectionInputType = { id: number; name: string } & {
  aboutMe: string
  photoUrl: string
} & PersonEducationType &
  PersonCareerInterface &
  PersonSkillClass

/**
 * Part of Person - education information.
 */
type PersonEducationType = {
  degree: string
  graduated: boolean
}

/**
 * Part of Person - career information.
 */
interface PersonCareerInterface {
  workingPlace: string
  seekingForJob: boolean
}

/**
 * Part of Person - skill information.
 */
export class PersonSkillClass {
  english!: boolean
  tajik!: boolean
}
