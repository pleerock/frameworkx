import { createApp } from "@microframework/core"
import { CategoryDeclaration, PostDeclaration } from "./declaration"

/**
 * Main application file.
 * Declares all types we have in the app.
 */
export const App = createApp<
  CategoryDeclaration &
    PostDeclaration & {
      inputs: {}
      queries: {}
      mutations: {}
      subscriptions: {}
      actions: {}
      context: {}
    }
>()
