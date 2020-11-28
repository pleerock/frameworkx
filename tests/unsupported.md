```ts
export const App = createApp<{
  models: {
    post: { id: number } | { id: string }
    post: Post[] | Post2[]
    post: (Post | Post2)[]
  }
  inputs: {
    postInput: Post | Post2
  }
  queries: {
    post(args: PostInput[]): PostType & PostType2[]
    post(): PostType[] & PostType2[]
    post(args: PostInput | PostInput2)
  }
  mutations: {
  }
  actions: {
    "GET /post/:id": {
      params: {
        id: number
      }
      return: Post | Category
    }
  }
  subscriptions: {
  }
}>()
```
