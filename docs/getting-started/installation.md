# Installation

* [Using CLI](#using-cli)
    * [Create a project](#create-a-project)
    * [Install dependencies](#install-dependencies)
    * [Run the project](#run-the-project)
* [Manual installation](#manual-installation)
    * [Create a new project](#create-a-new-project)
    * [Setup TypeScript compiler](#setup-typescript-compiler)
    * [Basic application structure](#basic-application-structure)
    * [Create a basic model and input](#create-a-basic-model-and-input)
    * [Create basic queries and mutations](#create-basic-queries-and-mutations)
    * [Create basic resolvers](#create-basic-resolvers)
    * [Run project](#run-project)

## Using CLI

### Create a project

You can use microframework's CLI to generate a project scaffold.
Use following command to generate a new `my-project` directory with a new project inside:

```shell script
npx @microframework/cli init my-project
```

There are 3 types of project skeletons you can generate:

* [monolith]()
* [monorepo]()
* [microservices]()

By default `init` command generates a monolith skeleton.
You can use a `--type` option to generate a different skeleton, e.g.

```shell script
npx @microframework/cli init my-project --type monorepo
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

### Create a new project

Create a new directory for new project:

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
    "typescript": "4.5.4"
  },
  "scripts": {
    "start": "tsc && node ./_/index.js",
    "watch": "tsc -w"
  }
}
```

Now you can install required dependencies:

```shell script
npm install
```

### Setup TypeScript compiler

Create a `tsconfig.json` file:

```shell script
touch tsconfig.json
```

And put a following basic configuration:

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

Now you'll be able to compile a source code by using a following command:

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

export const App = createApp<{
  models: {
    // we'll register our models later here
  }
  inputs: {
    // we'll register our inputs later here
  }
  queries: {
    // we'll register our queries later here
  }
  mutations: {
    // we'll register our mutations later here
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
import { App } from "./app"

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
  resolvers: [
    // we'll register resolvers later here
  ],
})
```

Server configuration file used to set up a server launch options,
connect the server to [application declaration]() and registers
[resolvers]() (controllers) that are going to serve all incoming HTTP queries.
In this configuration `appPath` is super important option - it must contain a file system
path to a TypeScript file (`.ts` or `.d.ts`) with [application declaration]() inside.
Name should not contain an extension. In our example project it is a reference to a `src/app.ts` file. 


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

Let's suppose we have a `Post` model, an interface representation of a website post.
Create a `src/models.ts` file and put our first model in there:

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

On our website we also have a functionality to create and save our posts.
In order for our backend to be able to receive a [user input](), let's create a 
`src/inputs.ts` file with `PostSaveInput` type inside:

```ts
// src/inputs.ts
/**
 * This input is used to create or update a post.
 */
export type PostSaveInput = {
  /**
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

Beside `type` declaration, you can also use a `class` or an `interface`.
We suggest using a `type` because it's the most powerful way to create a declaration.

Also, in a real-world projects you most likely to separate different models in a different files,
under the `model` directory of your project. See [structuring best practices guide]().

Next, we must register newly created models and inputs in the [application declaration]() file.

```ts
// src/app.ts
import { createApp } from "@microframework/core"
import { Post } from "./models"
import { PostSaveInput } from "./inputs"

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

Now, we need to "register" what kind of queries and mutations client is able to execute.
We want to be able to execute the following operations:

* load all posts
* get a single post by its id
* save a post
* remove post

Any load operations called [query](), and any operation implying a user state change called [mutation]().
Let's register in our application declarations `posts`, `post` queries and `postSave`, `postRemove` mutations:

```ts
// src/app.ts
import { createApp } from "@microframework/core"
import { Post } from "./models"
import { PostSaveInput } from "./inputs"

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

Now when we have all declarations in place, 
it's time to provide actual logic that will **resolve** all the data we want.
We'll put this logic into the resolver.
**Resolver** is the same as *controller* from MVC world.

There are [many ways]() how we can define a resolver, 
we'll just use a single object resolver with resolvers for all queries and mutations we have.  
Create a `src/resolvers.ts` file:

```ts
// src/resolvers.ts
import { App } from "./app"
import { Post } from "./models"

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

  async posts() {
    // todo: load posts from a database, e.g.
    //       await PostRepository.find()
    return [
      { id: 1, title: "First post", text: "About first post" },
      { id: 2, title: "Second post", text: "About second post" },
      { id: 3, title: "Third post", text: "About third post" },
    ]
  },

  async postSave(input) {
    const post: Post = {
      id: input.id || undefined,
      title: input.title,
      text: input.text,
    }
    // todo: save the post in the database, e.g.
    //       await PostRepository.save(post)
    return post
  },

  async postRemove({ id }) {
    // todo: remove the post from the database, e.g.
    //       await PostRepository.remove({ id })
    return true
  },

})
```

We must register a newly created resolver in application server:

```ts
// src/server.ts
import { createApplicationServer } from "@microframework/node"
import { App } from "./app"
import { PostDeclarationResolver } from "./resolvers"

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
  resolvers: [
    PostDeclarationResolver
  ],
})
```

### Run project

To run the project just run `npm start`.
Once it gets start open http://localhost:4000/graphql in your browser
and start writing GraphQL queries.
