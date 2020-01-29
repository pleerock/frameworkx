import * as typeorm from "typeorm"
import { connection } from "typeorm";

export const AppConnection = connection({
    type: "sqlite",
    database: __dirname + "/../database.sqlite",
    synchronize: true,
    logging: false,
})
