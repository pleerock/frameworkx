import {app} from "../app";
import {Status} from "../enum/Status";

export const UserTypeResolver = app
    .model("UserType")
    .resolve({
        fullName(user) {
            return user.firstName + " " + user.lastName
        },
        status() {
            return Status.active
        },
        activation() {
            return "activated"
        }
    })
