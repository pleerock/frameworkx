import { Category } from "./Category"
import { Post } from "./Post"
import { User } from "./User"

/**
 * Allows to search everything we have - users, posts and categories.
 */
export type SearchType = User | Post | Category
