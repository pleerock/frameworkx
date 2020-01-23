import {app} from "@microframework/client-server-sample-common";

export const CategoryQueryResolver = app
    .query("category")
    .resolve(() => {
        return {
            id: 1
        }
    })
