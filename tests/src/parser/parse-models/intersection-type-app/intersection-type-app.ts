import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    PersonIntersectionType: PersonIntersectionType
    PersonEducationType: PersonEducationType & { type: string }
  }
}>()

/**
 * This way we are testing intersection type.
 */
type PersonIntersectionType = { id: number; name: string } & {
  aboutMe: string | undefined
  photoUrl: string | null
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
class PersonSkillClass {
  english!: boolean
  tajik!: boolean
}
