import { createApp } from "@microframework/core"
import { AlbumStatusType } from "../model/AlbumStatusType"
import { AlbumType } from "../model/AlbumType"

export const App = createApp<{
  models: {
    AlbumType: AlbumType
    AlbumStatusType: AlbumStatusType
  }
}>()
