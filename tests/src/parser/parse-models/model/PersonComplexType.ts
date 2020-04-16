import { Float } from "@microframework/core"
import { PhotoInterface } from "./PhotoInterface"
import { PostModel } from "./PostModel"
import { StatusEnum } from "./StatusEnum"

/**
 * Complex type support test.
 */
export type PersonComplexType = {
    id: number
    firstName: string
    lastName: string
    alternativeNames: string[]
    age: number
    isActive: boolean
    career: {
        organization: {
            name: string
            description: string
        }
        position: string
    }
    educations: {
        name: string
        from: number
        to: number
        degree: string
    }[]
    mainPhoto: PhotoInterface
    photos: PhotoInterface[]
    posts: PostModel[]

    rating: Float
    status: StatusEnum
    // statusLiteral: "active" | "inactive"
    // statusNumberLiteral: 1 | 2



    // todo: add float, enum, literal types
}
