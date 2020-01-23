import * as typeorm from "typeorm"
import {app} from "../app";

export const UserRepository = app
    .model("UserType")
    .repository(repository => ({
    }))
