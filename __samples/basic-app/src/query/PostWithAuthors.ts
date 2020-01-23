export type PostWithAuthors = {
    id: number
    name: string
    author: {
        id: number
        firstName: string
        lastName: string
    }
}

export type PostSaveArgs = {
    id: number
    name: string
}

export type PostSaveResult = {
    id: number
}

export type PostWithAuthorsQuery = {
    id: number
    name: string
    author: {
        id: number
        firstName: string
        lastName: string
    }
}

// function query<T>() {
//
// }
//
// query<PostWithAuthorsQuery>({
//     author: {
//
//     }
// })