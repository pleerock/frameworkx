import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    PhotoInterface: PhotoInterface
  }
}>()

/**
 * This way we are testing interface support.
 */
interface PhotoInterface {
  id: number
  filename: string
}
