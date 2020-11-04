import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    PhotoInterface: PhotoInterface
  }
}>()

/**
 * This way we are testing interface support.
 */
export interface PhotoInterface {
  id: number
  filename: string
}
