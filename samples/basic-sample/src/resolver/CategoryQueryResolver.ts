import {app} from "../app";

export const CategoryQueryResolver = app
    .query("category")
    .resolve(() => {
        return {
            id: 1
        }
    })
