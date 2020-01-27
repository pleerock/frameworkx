import * as typeorm from "typeorm"
import { AppConnection } from "../app/AppConnection"
import { Category } from "../model/Category"

export const CategoryRepository = AppConnection.getRepository<Category>(
  "CategoryType",
)
