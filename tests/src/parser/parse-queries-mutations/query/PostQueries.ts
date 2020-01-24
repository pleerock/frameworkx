import {PostModel} from "../model/PostModel";

export type PostQueries = {
    post(): PostModel,
    posts(): PostModel[],
}
