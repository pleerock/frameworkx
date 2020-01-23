import {app} from "./index";

app.query("post")
    .fetch("postWithAuthor", { id: 1}, {
        description: {
            shorten: 1,
        }
    })

app
    .query("post")
    .fetch("postWithAuthor", { id: 1 }, {
        description: {
            shorten: 1
        }
    })
    .then(value => {
        console.log(value.id)
        // value.name
    })


app
    .action("get", "/users")
    .resolve(() => {
        return {

        }
    })
// .mutation("deletePost")
// .resolve((args) => {
//   return {
//     id: 1
//   }
// })

// app.model("User").resolve({
//     firstName: "dsada"
// })

// export const app = createApp({
//   actions: {
//     "/users": action("get")
//   },
//   queries: {
//     posts: query<Post[]>(),
//     post: query<Post, { id: number }>(),
//     post: args(PostModel, {
//       id: Number,
//     })
//   },
//   mutations: {
//     savePost: args(PostModel, {
//       post: PostSaveInput
//     }),
//     deletePost: args(PostModel, {
//       id: Number,
//     }),
//   },
//   models: {
//     PostModel,
//     UserModel,
//   },
//   inputs: {
//     PostSaveInput,
//   },
//   context: {
//     currentUser: UserModel
//   },
// })

// export type App2 = {
//   queries: {
//     posts: {
//       return: Post[]
//     }
//     post: { return: Post, args: { id: number } }
//   },
//   mutations: {
//     savePost: {
//       return: Post,
//       args: {
//         post: {} // PostInput
//       }
//     },
//     deletePost: {
//       return: Post,
//       args: {
//         id: number
//       }
//     }
//   }
// }
//
// type Params = Parameters<App["queries"]["post"]>[0]

