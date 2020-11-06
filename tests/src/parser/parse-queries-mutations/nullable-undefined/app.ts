import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostType
  }
  inputs: {
    PostFilterInput: PostFilterInput
  }
  queries: {
    postA(args: { id: number }): PostType | undefined
    postB(args: { id: number | undefined }): PostType | null
    postC(args: { id: number | null | undefined }): PostType | null | undefined

    postsA(args: PostFilterInput): PostType[]
    postsB(args: PostFilterInput | undefined): PostType[] | undefined
    postsC(args: PostFilterInput | null): PostType[] | null
    postsD(
      args: PostFilterInput | null | undefined,
    ): PostType[] | null | undefined
  }
}>()

type PostType = {
  id: number
  name: string
}

type PostFilterInput = {
  id: number
  name: string | null
  title: string | undefined
  text: string | null | undefined
}
