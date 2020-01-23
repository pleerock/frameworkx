import {createApp} from "@microframework/core";
import {PhotoInterface} from "../model/PhotoInterface";

export const App = createApp<{
    models: {
        PhotoInterface: PhotoInterface,
    },
}>()
