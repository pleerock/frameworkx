import { createApp, Float, DateTime, Time } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostType
    PostTypeDeprecated: PostTypeDeprecated
  }
  queries: {
    test(): boolean
  }
}>()

/**
 * This way we are testing type support.
 */
type PostType = {
  number: number
  numberArray: number[]
  numberUndefined: number | undefined
  numberNullable: number | null

  string: string
  stringArray: string[]
  stringUndefined: string | undefined
  stringNullable: string | null

  boolean: boolean
  booleanArray: boolean[]
  booleanUndefined: boolean | undefined
  booleanNullable: boolean | null

  float: Float
  floatArray: Float[]
  floatUndefined: Float | undefined
  floatNullable: Float | null

  bigint: bigint
  bigintArray: bigint[]
  bigintUndefined: bigint | undefined
  bigintNullable: bigint | null

  bigintObj: BigInt
  bigintObjArray: BigInt[]
  bigintObjUndefined: BigInt | undefined
  bigintObjNullable: BigInt | null

  date: Date
  dateArray: Date[]
  dateUndefined: Date | undefined
  dateNullable: Date | null

  dateTime: DateTime
  dateTimeArray: DateTime[]
  dateTimeUndefined: DateTime | undefined
  dateTimeNullable: DateTime | null

  time: Time
  timeArray: Time[]
  timeUndefined: Time | undefined
  timeNullable: Time | null
}

/**
 * This type is deprecated.
 * @deprecated
 */
type PostTypeDeprecated = {
  /**
   * @deprecated
   */
  id: number

  /**
   * This property is deprecated
   * @deprecated Does not need anymore
   */
  name: number
}
