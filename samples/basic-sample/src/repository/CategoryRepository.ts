import * as typeorm from "typeorm"
import {app} from "../app";

export const CategoryRepository = app
    .model("CategoryType")
    .repository(repository => ({
        findAllPosts() {
            return repository.find()
        }
    }))
