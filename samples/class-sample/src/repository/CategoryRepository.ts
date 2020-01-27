import { repository } from "typeorm"
import { CategoryType } from "../model/Category"
import * as typeorm from "typeorm"

export const CategoryRepository = repository<CategoryType>("CategoryType")
