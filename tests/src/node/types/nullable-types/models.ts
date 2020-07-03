import { Float } from "@microframework/core"

export type PostType = {
  id: number

  questionMarked?: string
  undefinedMarked: string | undefined
  nullableMarked: string | null
  undefinedAndNullableMarked: string | undefined | null
  everythingMarked?: string | undefined | null

  arrayQuestionMarked?: string[]
  arrayUndefinedMarked: string[] | undefined
  arrayNullableMarked: string[] | null
  arrayUndefinedAndNullableMarked: string[] | undefined | null
  arrayEverythingMarked?: string[] | undefined | null

  floatQuestionMarked?: Float
  floatUndefinedMarked: Float | undefined
  floatNullableMarked: Float | null
  floatUndefinedAndNullableMarked: Float | undefined | null
  floatEverythingMarked?: Float | undefined | null
  floatArrayAndMarked?: Float[] | undefined | null
}

export type PostInput = {
  questionMarked?: string
  undefinedMarked: string | undefined
  nullableMarked: string | null
  undefinedAndNullableMarked: string | undefined | null
  everythingMarked?: string | undefined | null

  arrayQuestionMarked?: string[]
  arrayUndefinedMarked: string[] | undefined
  arrayNullableMarked: string[] | null
  arrayUndefinedAndNullableMarked: string[] | undefined | null
  arrayEverythingMarked?: string[] | undefined | null

  floatQuestionMarked?: Float
  floatUndefinedMarked: Float | undefined
  floatNullableMarked: Float | null
  floatUndefinedAndNullableMarked: Float | undefined | null
  floatEverythingMarked?: Float | undefined | null
  floatArrayAndMarked?: Float[] | undefined | null
}
