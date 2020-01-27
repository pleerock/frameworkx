import {CategoryType} from "./Category";
import {PostType} from "./Post";
import {UserType} from "./User";

/**
 * Allows to search everything we have - users, posts and categories.
 */
export type SearchType = UserType | PostType | CategoryType
