import {app} from "../app";

export const UserTypeResolver = app
    .model("UserType")
    .resolve({
        fullName(user) {
            return user.firstName + " " + user.lastName
        },
    })
