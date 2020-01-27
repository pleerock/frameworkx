import * as typeorm from "typeorm"
import { AppConnection } from "../AppConnection"
import { UserType } from "../model/User"

export const UserRepository = AppConnection.getRepository<UserType>("UserType")
