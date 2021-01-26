import { createApp, Float, DateTime, Time } from "@microframework/core"

export const App = createApp<{
  inputs: {
    PostInput: PostInput
  }
  queries: {
    test(): boolean
  }
}>()

/**
 * This way we are testing type support.
 */
type PostInput = {
  number: number
  numberUndefined: number | undefined
  numberNullable: number | null

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
