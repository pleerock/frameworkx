import { repository } from "typeorm"
import { UserType } from "../model/User"
import * as typeorm from "typeorm"

export const UserRepository = repository<UserType>("UserType")
