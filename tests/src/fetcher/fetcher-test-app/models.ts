import { Float } from "@microframework/core"

export type PostType = {
  id: number
  title: string
  categories: CategoryType[]
  primaryCategory: CategoryType
  secondaryCategory?: CategoryType | null
  active: boolean
  likes: Float
  createdAt: Date | null
}

export type CategoryType = {
  id: number
  name: string
  posts: PostType[]
}

export type PostFilterInput = {
  take: number
  skip: number
  active?: boolean | null
  ids: number[]
  categoryIds?: { id: number }[]
}

export type PostSearchInput = {
  keyword?: string | null
  filter: PostFilterInput
}

export type ContentType = "post" | "category"
