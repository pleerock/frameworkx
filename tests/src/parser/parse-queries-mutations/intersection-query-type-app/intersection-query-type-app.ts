import { createApp } from "@microframework/core"

export const App = createApp<{
  queries: {
    post(): { id: number } & { title: string }
    post2(): PostType & PostData
    post3(): PostType & { title: string }
  }
}>()

type PostType = {
  id: number
  name: string
}

type PostData = {
  title: string
  text: string
}
