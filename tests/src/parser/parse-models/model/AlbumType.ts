import { AlbumStatusType } from "./AlbumStatusType";

/**
 * This way we are testing type support.
 */
export type AlbumType = {
    id: number
    name: string
    stars: number[]
    status: AlbumStatusType
}
