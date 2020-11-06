# Installation

* Using CLI
    * Create a project
    * Install dependencies
    * Run the project
* Manual installation
    * Setup package manager
    * Setup TypeScript compiler
    * 

## Using CLI

### Create a project

You can use microframework's CLI to generate a project scaffold.
Use following command to generate a new `my-project` directory with a new project inside:

```shell script
npx @microframework/core init my-project
```

There are 3 types of project skeletons you can generate:

* monolith []
* monorepo []
* microservices []

By default `init` command generates a monolith skeleton.
You can use a `--type` option to generate a different skeleton, e.g.

```shell script
npx @microframework/core init my-project --type monorepo
```

`monorepo` and `microservices` are advanced skeleton types, 
for beginners it's recommended to use a `monolith` skeleton type.

### Install dependencies

Install all `node_modules` dependencies:

```shell script
cd my-project
npm install
```


### Run the project

To run the project just run `npm start`.
Your `my-project` application is now running on http://localhost:4000.

Now you can open `my-project` directory in your 
favorite code editor and [start tweaking things](./project-structure.md).


## Manual installation

### Setup package manager

Create an empty directory for a new project:

```shell script
mkdir my-project
cd my-project
```

Create the `package.json` file:

```shell script
touch package.json
```

And put following content inside:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "main": "_/index.js",
  "dependencies": {
    "@microframework/core": "*",
    "@microframework/node": "*"
  },
  "devDependencies": {
    "@types/node": "^14.11.1",
    "typescript": "^4.1.1-rc"
  },
  "scripts": {
    "start": "tsc && node ./_/index.js",
    "watch": "tsc -w"
  }
}
```

Now you can install all required dependencies:

```shell script
npm install
```

### Setup TypeScript compiler

Create a `tsconfig.json` file:

```shell script
touch tsconfig.json
```

And put a following basic TypeScript compiler configuration:

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "moduleResolution": "node",
    "outDir": "_",
    "declaration": true,
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

It's important to enable `declaration` flag in `compilerOptions`, 
because framework heavily rely on this option.

Now you'll be able to compile your source code by using a following command:

```shell script
npm run watch
```

### Basic application structure

Let's put all application source code into the `src` directory:

```shell script
mkdir src
```

Application consist of a following files:

* `app.ts` contains [application declaration]()
* `server.ts` contains an [express server configuration]()
* `index.ts` launches the server

First let's create `src/app.ts` file with application declaration inside:

```ts
// src/app.ts
import { createApp } from "@microframework/core"
import { Post } from "../model"
import { CategorySaveInput, PostSaveInput } from "../input"

export const App = createApp<{
  models: {
    // we'll register our models here
  }
  inputs: {
    // we'll register our inputs here
  }
  queries: {
    // we'll register our queries here
  }
  mutations: {
    // we'll register our mutations here
  }
}>()
```

Application declaration is a special file, 
where we register all [models](), [inputs](), [queries]() and [mutations]().
These declarations used to provide a type-safe code, 
generate a GraphQL schema and project documentation.

Next, create a `src/server.ts` file with server configuration:

```ts
// src/server.ts
import { createApplicationServer } from "@microframework/node"
import { App } from "./App"

export const AppServer = createApplicationServer(App, {
  appPath: __dirname + "/app",
  webserver: {
    port: 4000,
    cors: true,
  },
  graphql: {
    graphiql: true,
    playground: true,
  },
  resolvers: {
    // we'll register resolvers later here
  },
})
```

Server configuration file used to set up a server launch options,
it also connects your server to [application declaration]() and registers
[resolvers]() (controllers) that are going to serve all incoming HTTP queries.
In this configuration `appPath` is super important option - it must contain a file system
path to a TypeScript file (`.ts` or `.d.ts`) with [application declaration]() inside.
Name should not contain an extension. In our example project it is a reference to `src/app.ts` file. 


Next, create a `src/index.ts` file:

```ts
// src/index.ts
import { AppServer } from "./server"

AppServer.start()
  .then(() => {
    console.log(
      "Running at http://localhost:4000/graphql",
    )
  })
  .catch((error) => {
    console.error(error)
  })
```

This file bootstraps our web server.

To run the project just run `npm start`.
Your `my-project` application is now running on http://localhost:4000.

### Create a basic model and input

Let's suppose we have a `Post` model, it's purpose is to 

```ts
// src/models.ts
/**
 * Dummy website Post.
 */
export type Post = {
  /**
   * Unique post id.
   */
  id: number

  /**
   * Post title.
   */
  title: string

  /**
   * Post content. Can be empty.
   */
  text: string | null

  /**
   * Indicates if post is moderated or not.
   */
  status: "under_moderation" | "moderated"
}
```

Let's suppose we have a `PostSaveInput` input.

```ts
// src/inputs.ts
/**
 * This input is used to create or update a post.
 */
export type PostSaveInput = {
  /**
   * Updating post id.
   * If id isn't specified, it means this input tries to create a new post.
   */
  id?: number | null

  /**
   * Post title.
   */
  title: string

  /**
   * Post text.
   */
  text?: string | null
}
```

Note: beside `type` declaration, you can also use a `class` or an `interface`.
We suggest using a `type` because it's the most powerful way to create a declaration.

Next, we must register newly created models and inputs in the [application declaration]() file.

```ts
// src/app.ts
import { createApp } from "@microframework/core"
import { Post } from "../model"
import { CategorySaveInput, PostFilterInput, PostSaveInput } from "../input"

export const App = createApp<{
  models: {
    Post: Post
  }
  inputs: {
    PostSaveInput: PostSaveInput
  }
}>()
```

### Create basic queries and mutations

```ts
// src/app.ts
import { createApp } from "@microframework/core"
import { Post } from "../model"
import { CategorySaveInput, PostFilterInput, PostSaveInput } from "../input"

/**
 * Main application declarations file.
 */
export const App = createApp<{
  models: {
    Post: Post
  }

  inputs: {
    PostSaveInput: PostSaveInput
  }

  queries: {

    /**
     * Loads all posts.
     */
    posts(): Post[]

    /**
     * Loads a single post by its id.
     * Returns null if post was not found.
     */
    post(input: { id: number }): Post | null

  }

  mutations: {
    /**
     * Saves a post.
     *
     * If post id is given, it tries to update exist post.
     * If post id is not given, it will create a new post.
     */
    postSave(input: PostSaveInput): Post

    /**
     * Removes a post with a given id.
     * Returns false if post with a given id was not found.
     */
    postRemove(input: { id: number }): boolean
  }
}>()
```

### Create basic resolvers

```ts
import { In } from "typeorm"
import { App, AppPubSub } from "../app"
import { PostFilterInput, PostSaveInput } from "../input"
import { CategoryRepository, PostRepository } from "../repository"

/**
 * Resolver for post declarations.
 */
export const PostDeclarationResolver = App.resolver({
  async post({ id }) {
    // todo: load post from a database by it's id, e.g.
    //       await PostRepository.findOne({ id })
    return {
      id,
      title: "Demo post"
    }
  },
  async posts(input: PostFilterInput) {
    return PostRepository.findAllPosts(input.skip, input.take)
  },

  async postSave(input: PostSaveInput) {
    const post = await PostRepository.save({
      id: input.id || undefined,
      title: input.title,
      text: input.text,
    })

    if (input.categoryIds) {
      const categories = await CategoryRepository.find({
        id: In(input.categoryIds),
      })
      await PostRepository.save({
        id: post.id,
        categories,
      })
    }

    if (!input.id) {
      await AppPubSub.publish("POST_CREATED", post)
    }
    return post
  },
})
```