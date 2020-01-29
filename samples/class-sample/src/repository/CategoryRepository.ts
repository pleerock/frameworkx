import { Model } from "@microframework/model";
import { EntityTarget } from "typeorm";
import * as typeorm from "typeorm"
import { AppConnection } from "../app/AppConnection"
import { AppModels } from "../app/AppModels";
import { Category } from "../model";

const target: EntityTarget<Category> = new Model<Category>("Category")
export const CategoryRepository = AppConnection.getRepository(target)
