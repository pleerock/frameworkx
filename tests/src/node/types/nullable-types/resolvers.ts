import { resolver } from "@microframework/core"
import { App } from "./app"

export const PostResolver = resolver(App, "post", ({ id }) => {
  return {
    id,
    questionMarked: "some value",
    undefinedMarked: undefined,
    nullableMarked: null,
    undefinedAndNullableMarked: undefined,
    everythingMarked: null,

    arrayQuestionMarked: undefined,
    arrayUndefinedMarked: ["some value"],
    arrayNullableMarked: null,
    arrayUndefinedAndNullableMarked: [],
    arrayEverythingMarked: undefined,

    floatQuestionMarked: undefined,
    floatUndefinedMarked: undefined,
    floatNullableMarked: 1.1,
    floatUndefinedAndNullableMarked: null,
    floatEverythingMarked: 2.2,
    floatArrayAndMarked: [1.1, 2.2],
  }
})

export const PostCreateResolver = resolver(App, "postCreate", (post) => {
  return {
    id: 1,
    ...post,
  }
})
