import * as typeorm from "typeorm"
import { AppConnection } from "../app/AppConnection"
import { AppModels } from "../app/AppModels";

export const UserRepository = AppConnection.getRepository(AppModels.User)
