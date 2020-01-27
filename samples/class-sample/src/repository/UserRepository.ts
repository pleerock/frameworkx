import * as typeorm from "typeorm"
import { AppConnection } from "../app/AppConnection"
import { User } from "../model"

export const UserRepository = AppConnection.getRepository<User>("User")
