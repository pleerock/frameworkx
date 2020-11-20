```ts
export const App = createApp<{
  models: {
  }
  inputs: {
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
