import { Float } from "@microframework/core"

export type PostType = {
  id: number
  views: number
  title: string
  published: boolean
  coefficient: Float
  tags: string[]
  counters: number[]
  coefficients: Float[]
}

export type PostInput = {
  title: string
  views: number
  published: boolean
  coefficient: Float
  tags: string[]
  counters: number[]
  coefficients: Float[]
}
