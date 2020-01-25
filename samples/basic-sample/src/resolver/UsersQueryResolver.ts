import {app} from "../app";
import {UserRepository} from "../repository/UserRepository";

export const UsersQueryResolver = app
    .query("users")
    .resolve(() => {
        return UserRepository.find()
    })
