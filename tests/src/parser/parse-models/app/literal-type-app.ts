import { createApp } from "@microframework/core"
import { AlbumType } from "../model/AlbumType"
import { AlbumStatusType } from "../model/AlbumStatusType"

export const App = createApp<{
    models: {
        AlbumType: AlbumType
        AlbumStatusType: AlbumStatusType
    },
}>()
