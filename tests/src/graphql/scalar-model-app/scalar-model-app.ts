import { createApp, Float, DateTime, Time } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostType
  }
}>()

/**
 * This way we are testing type support.
 */
type PostType = {
  number: number
  numberUndefined: number
  numberNullable: number

  string: string
  stringUndefined: string | undefined
  stringNullable: string | null

  boolean: boolean
  booleanUndefined: boolean | undefined
  booleanNullable: boolean | null

  float: Float
  floatUndefined: Float | undefined
  floatNullable: Float | null

  bigint: bigint
  bigintUndefined: bigint | undefined
  bigintNullable: bigint | null

  bigintObj: BigInt
  bigintObjUndefined: BigInt | undefined
  bigintObjNullable: BigInt | null

  date: Date
  dateUndefined: Date | undefined
  dateNullable: Date | null

  dateTime: DateTime
  dateTimeUndefined: DateTime | undefined
  dateTimeNullable: DateTime | null

  time: Time
  timeUndefined: Time | undefined
  timeNullable: Time | null
}
