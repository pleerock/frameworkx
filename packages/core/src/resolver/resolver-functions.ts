import { AnyModel, isModel } from "@microframework/model"
import {
  AnyApplication,
  AnyApplicationOptions,
  Application,
  ContextList,
  DeclarationKeys,
  ForcedType,
  LiteralOrClass,
} from "../application"
import {
  AnyResolver,
  ContextResolver,
  ContextResolverMetadata,
  DeclarationResolver,
  ModelDLResolver,
  ModelResolver,
  ResolveStrategy,
} from "./index"

// todo: here we can add queryResolver(), mutationResolver(), subscriptionResolver() to support specific resolvers
// todo: we also need to think how we can elegantly made it in decorator
// todo: also probably need to add class support for context resolvers

/**
 * Resolvers provides some logic on resolving particular query / mutation / subscription / action or model property.
 * This particular function is used as decorator and resolves queries, mutations, subscriptions and actions.
 *
 * For example, for { query: { posts(): Post[], post(): Post } } declaration you can create a following resolver:
 *
 *    @resolver()
 *    export class PostDeclarationResolver {
 *        posts() {
 *          ...
 *        }
 *
 *        post() {
 *          ...
 *        }
 *    }
 */
export function resolver<
  App extends AnyApplication,
  Key extends keyof App["_options"]["models"]
>(): (object: any) => any

/**
 * Resolvers provides some logic on resolving particular query / mutation / subscription / action or model property.
 * This particular function is used as decorator and resolves model.
 *
 * For example, for model Post { id: number, title: string } you can create a following resolver:
 *
 *    @resolver(App, "Post")
 *    export class PostModelResolver {
 *        title(post) {
 *          ...
 *        }
 *    }
 */
export function resolver<
  App extends AnyApplication,
  Key extends keyof App["_options"]["models"]
>(app: App, name: Key): (object: any) => any

/**
 * Resolvers provides some logic on resolving particular query / mutation / subscription / action or model property.
 * This particular function is used as decorator and resolves model.
 * Using this signature you can configure additional resolving options.
 *
 * For example, for model Post { id: number, title: string } you can create a following resolver:
 *
 *    @resolver({ app: App, name: "Post", dataLoader: true })
 *    export class PostModelResolver {
 *        title(posts) {
 *          return posts.map(post => ...)
 *        }
 *    }
 */
export function resolver<
  App extends AnyApplication,
  Key extends keyof App["_options"]["models"]
>(options: { app: App; name: Key; dataLoader?: boolean }): (object: any) => any

/**
 * Resolvers provides some logic on resolving particular query / mutation / subscription / action or model property.
 * This particular function is used to create a resolver for bunch of query / mutation / subscription / action properties.
 *
 * For example, for { query: { posts(): Post[], post(): Post } } declaration you can create a following resolver:
 *
 *    export const PostDeclarationResolver = resolver(App, {
 *        posts() {
 *          ...
 *        }
 *
 *        post() {
 *          ...
 *        }
 *    })
 */
export function resolver<
  App extends AnyApplication,
  Key extends DeclarationKeys<App["_options"]>
>(app: App, resolver: LiteralOrClass<DeclarationResolver<App>>): AnyResolver

/**
 * Resolvers provides some logic on resolving particular query / mutation / subscription / action or model property.
 * This particular function is used to create a resolver for a single query / mutation / subscription / action / model.
 *
 * For example, for { query: { posts(): Post[], post(): Post } } declaration you can create a following resolver:
 *
 *    export const PostsQueryResolver = resolver(App, "posts", () => {
 *      return [...]
 *    })
 *
 * Another example, for model Post { id: number, title: string } you can create a following resolver:
 *
 *    export const PostsQueryResolver = resolver(App, "Post", {
 *        title(post) {
 *          ...
 *        }
 *    })
 */
export function resolver<
  App extends AnyApplication,
  Key extends DeclarationKeys<App["_options"]>
>(
  app: App,
  name: Key,
  resolver: ResolveStrategy<App["_options"], Key>,
): AnyResolver

/**
 * Resolvers provides some logic on resolving particular query / mutation / subscription / action or model property.
 * This particular function is used to create a resolver for a single query / mutation / subscription / action / model.
 *
 * For example, for { query: { posts(): Post[], post(): Post } } declaration you can create a following resolver:
 *
 *    export const PostsQueryResolver = resolver(App, "posts", () => {
 *      return [...]
 *    })
 *
 * Another example, for model Post { id: number, title: string } you can create a following resolver:
 *
 *    export const PostsQueryResolver = resolver(App, "Post", {
 *        title(post) {
 *          ...
 *        }
 *    })
 */
export function resolver<App extends AnyApplication, Model extends AnyModel>(
  app: App,
  model: Model,
  resolver:
    | LiteralOrClass<ModelResolver<Model["type"], App["_options"]["context"]>>
    | (() => LiteralOrClass<
        ModelResolver<Model["type"], App["_options"]["context"]>
      >),
): AnyResolver

/**
 * Resolvers provides some logic on resolving particular query / mutation / subscription / action or model property.
 * This particular function is used to create a resolver for a particular model.
 * Using this signature you can configure additional resolving options.
 *
 * For example, for model Post { id: number, title: string } you can create a following resolver:
 *
 *    export const PostsQueryResolver = resolver(App, { name: "Post", dataLoader: true }, {
 *        title(posts) {
 *          return posts.map(post => ...)
 *        }
 *    })
 */
export function resolver<
  App extends AnyApplication,
  Key extends keyof App["_options"]["models"]
>(
  app: App,
  options: { name: Key; dataLoader: true },
  resolver:
    | LiteralOrClass<
        ModelDLResolver<
          App["_options"]["models"][Key],
          App["_options"]["context"]
        >
      >
    | (() => LiteralOrClass<
        ModelDLResolver<
          App["_options"]["models"][Key],
          App["_options"]["context"]
        >
      >),
): AnyResolver

/**
 * Resolvers provides some logic on resolving particular query / mutation / subscription / action or model property.
 * This particular function is used to create a resolver for a particular model.
 * Using this signature you can configure additional resolving options.
 *
 * For example, for model Post { id: number, title: string } you can create a following resolver:
 *
 *    export const PostsQueryResolver = resolver(App, { model: PostModel, dataLoader: true }, {
 *        title(posts) {
 *          return posts.map(post => ...)
 *        }
 *    })
 */
export function resolver<App extends AnyApplication, Model extends AnyModel>(
  app: App,
  options: { model: Model; dataLoader: true },
  resolver:
    | LiteralOrClass<ModelDLResolver<Model["type"], App["_options"]["context"]>>
    | (() => LiteralOrClass<
        ModelDLResolver<Model["type"], App["_options"]["context"]>
      >),
): AnyResolver

/**
 * Resolvers provides some logic on resolving particular query / mutation / subscription / action or model property.
 * This particular function is used to create a resolver for a particular model.
 * Using this signature you can configure additional resolving options.
 *
 * For example, for model Post { id: number, title: string } you can create a following resolver:
 *
 *    export const PostsQueryResolver = resolver(App, { name: "Post", dataLoader: true }, {
 *        title(posts) {
 *          return posts.map(post => ...)
 *        }
 *    })
 */
export function resolver<
  App extends AnyApplication,
  Key extends keyof App["_options"]["models"]
>(
  app: App,
  options: { name: Key; dataLoader?: false },
  resolver:
    | LiteralOrClass<
        ModelResolver<
          App["_options"]["models"][Key],
          App["_options"]["context"]
        >
      >
    | (() => LiteralOrClass<
        ModelResolver<
          App["_options"]["models"][Key],
          App["_options"]["context"]
        >
      >),
): AnyResolver

/**
 * Resolvers provides some logic on resolving particular query / mutation / subscription / action or model property.
 * This particular function is used to create a resolver for a particular model.
 * Using this signature you can configure additional resolving options.
 *
 * For example, for model Post { id: number, title: string } you can create a following resolver:
 *
 *    export const PostsQueryResolver = resolver(App, { model: PostModel, dataLoader: true }, {
 *        title(posts) {
 *          return posts.map(post => ...)
 *        }
 *    })
 */
export function resolver<App extends AnyApplication, Model extends AnyModel>(
  app: App,
  options: { model: Model; dataLoader?: false },
  resolver:
    | LiteralOrClass<ModelResolver<Model["type"], App["_options"]["context"]>>
    | (() => LiteralOrClass<
        ModelResolver<Model["type"], App["_options"]["context"]>
      >),
): AnyResolver

/**
 * Creates a new resolver metadata to resolve queries, mutations, subscriptions, actions or models.
 */
export function resolver(
  arg0?: AnyApplication | { name: string; dataLoader?: boolean },
  arg1?:
    | DeclarationKeys<any>
    | LiteralOrClass<DeclarationResolver<any>>
    | AnyModel,
  arg2?:
    | ResolveStrategy<any, any>
    | ModelResolver<any, any>
    | (() => ModelResolver<any, any>)
    | ModelDLResolver<any, any>
    | (() => ModelDLResolver<any, any>),
): AnyResolver | ((object: any) => any) {
  if (arguments.length === 0) {
    // resolves decorator for declarations
    // syntax @resolver() class CategoryDeclarationsResolver { ... }
    return function (constructor: any) {
      constructor.prototype.resolver = {
        "@type": "Resolver",
        type: "declaration-resolver",
        declarationType: "any",
        resolverFn: new constructor(),
      }
    }
  } else if (arguments.length === 1) {
    // resolves decorator for models with options
    // syntax @resolver({ name: "Category", dataLoader: true }) class CategoryModelResolver { ... }
    const options = arg0 as { name: string; dataLoader?: boolean }
    return function (constructor: any) {
      constructor.prototype.resolver = {
        "@type": "Resolver",
        type: "model-resolver",
        dataLoader: options.dataLoader || false,
        name: options.name,
        resolverFn: new constructor(),
      }
    }
  } else if (arguments.length === 2 && typeof arg1 === "string") {
    // resolves decorator for models
    // syntax @resolver(App, "Category") class CategoryModelResolver { ... }
    const name = arg1 as string
    return function (constructor: any) {
      constructor.prototype.resolver = {
        "@type": "Resolver",
        type: "model-resolver",
        dataLoader: false,
        name,
        resolverFn: new constructor(),
      }
    }
  } else if (arguments.length === 2 && arg1 instanceof Function) {
    // resolves root declarations
    // syntax: resolver(App, class { categories() { ... }, ... })
    return {
      "@type": "Resolver",
      type: "declaration-resolver",
      declarationType: "any",
      resolverFn: new (arg1 as any)(),
    }
  } else if (arguments.length === 2 && arg1 instanceof Object) {
    // resolves root declarations
    // syntax: resolver(App, { categories() { ... }, ... })
    const resolverFn = arg1 as DeclarationResolver<any>
    return {
      "@type": "Resolver",
      type: "declaration-resolver",
      declarationType: "any",
      resolverFn,
    }
  } else if (
    arguments.length === 3 &&
    typeof arg1 === "string" &&
    arg2 instanceof Function
  ) {
    // resolves a single declaration item
    // syntax: resolver(App, "categories", (args) => { ... })
    const name = arg1 as string
    const resolverFn = arg2 as (args: any, context: any) => any
    return {
      "@type": "Resolver",
      type: "declaration-item-resolver",
      declarationType: "any",
      name,
      resolverFn,
    }
  } else if (
    arguments.length === 3 &&
    typeof arg1 === "string" &&
    arg2 instanceof Object
  ) {
    // resolves a model
    // syntax: resolver(App, "CategoryModel", { name() { ... }, ... })

    const name = arg1 as string
    const resolverFn = arg2 as ModelResolver<any>
    return {
      "@type": "Resolver",
      type: "model-resolver",
      dataLoader: false,
      name,
      resolverFn,
    }
  } else if (
    arguments.length === 3 &&
    isModel(arg1) &&
    (arg2 instanceof Object || arg2 instanceof Function)
  ) {
    // resolves a model with second argument providing Model
    // syntax: resolver(App, CategoryModel, { name() { ... }, ... })

    const model = arg1 as AnyModel
    const resolverFn = (arg2 instanceof Function
      ? arg2()
      : arg2) as ModelResolver<any>
    return {
      "@type": "Resolver",
      type: "model-resolver",
      name: model.name,
      dataLoader: false,
      resolverFn,
    }
  } else if (
    arguments.length === 3 &&
    arg1 instanceof Object &&
    (arg2 instanceof Object || arg2 instanceof Function)
  ) {
    // resolves a model with second argument providing model options
    // syntax: resolver(App, { name: "CategoryModel", dataLoader: true }, { name() { ... }, ... })

    const modelOptions = arg1 as {
      name?: string
      model?: AnyModel
      dataLoader?: boolean
    }
    const name = modelOptions.model
      ? modelOptions.model.name
      : modelOptions.name
    const resolverFn = (arg2 instanceof Function
      ? arg2()
      : arg2) as ModelResolver<any>
    return {
      "@type": "Resolver",
      type: "model-resolver",
      name: name || "",
      dataLoader: modelOptions.dataLoader || false,
      resolverFn,
    }
  }

  throw new Error(`Invalid "resolver" function usage.`)
}

/**
 * Creates a context resolver.
 *
 * Example:
 *
 *    export const AppContext = contextResolver(App, {
 *        async currentUser({ request, response }) {
 *          return loadUserFromDb(request.headers.authorizationToken)
 *        }
 *    })
 */
export function contextResolver<
  App extends Application<Options>,
  Options extends AnyApplicationOptions
>(
  app: App,
  resolver: LiteralOrClass<
    ContextResolver<ForcedType<Options["context"], ContextList>>
  >,
): ContextResolverMetadata {
  const resolverFn = typeof resolver === "function" ? new resolver() : resolver
  return {
    "@type": "Resolver",
    type: "context",
    resolverFn,
  }
}
