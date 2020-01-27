import * as typeorm from "typeorm"
import { AppConnection } from "../app/AppConnection"
import { UserType } from "../model/User"

export const UserRepository = AppConnection.getRepository<UserType>("UserType")
