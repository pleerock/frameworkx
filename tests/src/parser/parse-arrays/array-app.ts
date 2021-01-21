// import { createApp } from "@microframework/core"
// import { Category } from "./model/Category"
// import { Post } from "./model/Post"
//
// export const App = createApp<{
//   models: {
//     Category: Category
//     Post: Post
//   }
// }>()

import { createApp } from "@microframework/core"
import { CategoryDeclaration, PostDeclaration } from "./declaration"

/**
 * Main application file.
 * Declares all types we have in the app.
 */
export const App = createApp<CategoryDeclaration & PostDeclaration>()
