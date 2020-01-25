import {app} from "../app";
import {CategoryRepository} from "../repository/CategoryRepository";

export const CategoryQueryResolver = app
    .query("category")
    .resolve(({ id }) => {
        return CategoryRepository.findOneOrFail(id)
    })
