import { createApp } from "@microframework/core"
import {
  CategoryDeclaration,
  PostDeclaration,
  SearchDeclaration,
  UserDeclaration,
} from "../declaration"

export const App = createApp<
    CategoryDeclaration &
    UserDeclaration &
    PostDeclaration &
    SearchDeclaration
>()
