import * as typeorm from "typeorm"
import { AppConnection } from "../app/AppConnection"
import { User } from "../model/User"

export const UserRepository = AppConnection.getRepository<User>("UserType")
