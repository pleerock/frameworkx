import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    AlbumType: AlbumType
  }
}>()

/**
 * This way we are testing type support.
 */
type AlbumType = {
  id: number
  name: string
  stars: number[]
  status: AlbumStatusType
}

/**
 * This way we are testing type support.
 */
type AlbumStatusType = "active" | "inactive"
