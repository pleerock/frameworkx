# Actions

Actions allow to create a RESTful / WebAPI endpoints.

First you need to define action in the [application declaration](application-declaration.md):

```typescript
export const App = createApp<{
  actions: {
    "GET /posts": {
      return: Post[]
    }
    "GET /posts/:id": {
      params: {
        id: number
      }
      return: Post
    }
    "POST /posts": {
      return: Post
    }
    "PUT /posts/:id": {
      params: {
        id: number
      }
      return: Post
    }
    "DELETE /posts/:id": {
      params: {
        id: number
      }
      return: {
        status: string
      }
    }
  }
}>
```