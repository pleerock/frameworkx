import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    BlogPostType: BlogPostType
    NewsPostType: NewsPostType
    PostMetaType: PostMetaType
    PostType: PostType
    Category: Category
    PostExtendedType: PostType | PostMetaType
  }
  queries: {
    test(): boolean
  }
}>()

// ------------------------------------------------

type PostType = BlogPostType | NewsPostType

class PostMetaType {
  id!: number
  status!: StatusEnum
}

type BlogPostType = {
  id: number
  text: string
}

class NewsPostType {
  id!: number
  title!: string
}

interface Category {
  id: number
  posts: BlogPostType | NewsPostType
}

enum StatusEnum {
  /**
   * Is on draft.
   */
  draft = "draft",

  /**
   * Is published.
   */
  published = "published",
}
