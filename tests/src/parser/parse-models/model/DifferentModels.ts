import {Model} from "@microframework/core";

/**
 * This way we are testing "Model" support with a regular type.
 */
export type PostTypeModel = Model<PostType, PostTypeArgs>

/**
 * This way we are testing "Model" support with a regular type.
 */
export type PostClassModel = Model<PostClass, PostClassArgs>

/**
 * This way we are testing "Model" support with a regular type.
 */
export type PostInterfaceModel = Model<PostInterface, PostInterfaceArgs>

/**
 * This way we are testing "Model" support with a literal type.
 */
export type PostLiteralModel = Model<
    { id: number, name: string },
    { name: { keyword: string } }
>

/**
 * Type for a PostTypeModel.
 */
export type PostType = {
    id: number
    name: string
}

/**
 * Class for a PostClassModel.
 */
export class PostClass {
    id!: number
    name!: string
}

/**
 * Interface for a PostModel.
 */
export interface PostInterface {
    id: number
    name: string
}

/**
 * Args for a PostTypeModel.
 */
export type PostTypeArgs = {
    name: {
        keyword: string
    }
}

/**
 * Args for a PostClassModel.
 */
export class PostClassArgs {
    name!: {
        keyword: string
    }
}

/**
 * Args for a PostInterfaceModel.
 */
export interface PostInterfaceArgs {
    name: {
        keyword: string
    }
}
