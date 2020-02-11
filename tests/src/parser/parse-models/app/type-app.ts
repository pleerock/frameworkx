import { createApp } from "@microframework/core"
import { AlbumType } from "../model/AlbumType"

export const App = createApp<{
    models: {
        AlbumType: AlbumType,
    },
}>()
