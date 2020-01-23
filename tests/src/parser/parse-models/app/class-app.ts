import {createApp} from "@microframework/core";
import {UserClass} from "../model/UserClass";

export const App = createApp<{
    models: {
        UserClass: UserClass,
    },
}>()
