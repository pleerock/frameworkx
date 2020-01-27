import * as typeorm from "typeorm"
import { AppConnection } from "../app/AppConnection"
import { Category } from "../model"

export const CategoryRepository = AppConnection.getRepository<Category>(
  "Category",
)
