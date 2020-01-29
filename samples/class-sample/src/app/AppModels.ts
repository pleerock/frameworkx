import { model } from "@microframework/model";
import { CategoryInput, PostFilterInput, PostInput } from "../input";
import { Category, Post, SearchType, User } from "../model";

export const AppModels = {
    Post: model<Post>("Post"),
    Category: model<Category>("Category"),
    User: model<User>("User"),
    Search: model<SearchType>("Search"),
    CategoryInput: model<CategoryInput>("CategoryInput"),
    PostFilterInput: model<PostFilterInput>("PostFilterInput"),
    PostInput: model<PostInput>("PostInput"),
}
