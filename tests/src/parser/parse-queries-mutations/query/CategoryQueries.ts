import { CategoryType } from "../model/Category"

export type CategoryQueries = {
    category(): CategoryType,
    categories(): CategoryType[],
}
