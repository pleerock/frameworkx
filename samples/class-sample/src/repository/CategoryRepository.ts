import * as typeorm from "typeorm"
import { AppConnection } from "../AppConnection"
import { CategoryType } from "../model/Category"

export const CategoryRepository = AppConnection.getRepository<CategoryType>(
  "CategoryType",
)
