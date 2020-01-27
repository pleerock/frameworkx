import { createApp } from "@microframework/core"
import { CategoryDeclaration } from "./declaration/CategoryDeclaration"
import { PostDeclaration } from "./declaration/PostDeclaration"
import { SearchDeclaration } from "./declaration/SearchDeclaration"
import { UserDeclaration } from "./declaration/UserDeclaration"

export const App = createApp<
    CategoryDeclaration &
    UserDeclaration &
    PostDeclaration &
    SearchDeclaration
    >()
