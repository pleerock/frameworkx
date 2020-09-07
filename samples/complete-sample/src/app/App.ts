import { createApp } from "@microframework/core"
import {
  CategoryDeclaration,
  PostDeclaration,
  SearchDeclaration,
  UserDeclaration,
} from "../declaration"

/**
 * Main application file.
 * Declares all types we have in the app.
 */
export const App = createApp<
  CategoryDeclaration & UserDeclaration & PostDeclaration & SearchDeclaration
>()
