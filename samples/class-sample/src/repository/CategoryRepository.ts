import * as typeorm from "typeorm"
import { AppConnection } from "../app/AppConnection"
import { CategoryType } from "../model/Category"

export const CategoryRepository = AppConnection.getRepository<CategoryType>(
  "CategoryType",
)
