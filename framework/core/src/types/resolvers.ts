import { Action, AnyApplication, AnyApplicationOptions, ContextList, DeclarationItem, ModelType } from "../app";

/**
 * Default framework properties applied to the user context.
 */
export type DefaultContext = {
  request: any
  response: any
}

/**
 * Type to provide resolvers for declarations (queries, mutations and subscriptions).
 */
export type DeclarationResolver<
    App extends AnyApplication | AnyApplicationOptions
> =
  App extends AnyApplication ? (
    & { [P in keyof App["_options"]["queries"]]?: DeclarationResolverFn<App["_options"]["queries"][P], App["_options"]["context"]> }
    & { [P in keyof App["_options"]["mutations"]]?: DeclarationResolverFn<App["_options"]["mutations"][P], App["_options"]["context"]> }
    & { [P in keyof App["_options"]["subscriptions"]]?: SubscriptionResolverFn<App["_options"]["mutations"][P], App["_options"]["context"]> }
    & { [P in keyof App["_options"]["actions"]]?: ActionResolverFn<App["_options"]["actions"][P], App["_options"]["context"]> }
  ) : App extends AnyApplicationOptions ? (
    & { [P in keyof App["queries"]]?: DeclarationResolverFn<App["queries"][P], App["context"]> }
    & { [P in keyof App["mutations"]]?: DeclarationResolverFn<App["mutations"][P], App["context"]> }
    & { [P in keyof App["subscriptions"]]?: SubscriptionResolverFn<App["mutations"][P], App["context"]> }
    & { [P in keyof App["actions"]]?: ActionResolverFn<App["actions"][P], App["context"]> }
  ) : unknown

export type ResolveKey<D extends AnyApplicationOptions> =
    | keyof D["actions"]
    | keyof D["models"]
    | keyof D["queries"]
    | keyof D["mutations"]
    | keyof D["subscriptions"]

export type Resolver = {
  instanceof: "Resolver"
  type: "declaration-resolver"
  declarationType: "any" | "query" | "mutation" | "subscription" | "action"
  resolverFn: DeclarationResolver<any>
} | {
  instanceof: "Resolver"
  type: "declaration-item-resolver"
  declarationType: "any" | "query" | "mutation" | "subscription" | "action"
  name: string
  resolverFn: ((args: any, context: any) => any) | SubscriptionResolverFn<any, any>
} | {
  instanceof: "Resolver"
  type: "model-resolver"
  name: string
  dataLoader: boolean
  resolverFn: ModelResolver<any>
}

export function isResolver(obj: any): obj is Resolver {
  return obj["instanceof"] && obj["instanceof"] === "Resolver"
}

export type ResolverFn<
    Options extends AnyApplicationOptions,
    Key extends ResolveKey<Options>
> =
  Key extends keyof Options["queries"] ? (
    DeclarationResolverFn<Options["queries"][Key], Options["context"]>
  ) :
  Key extends keyof Options["mutations"] ? (
    DeclarationResolverFn<Options["mutations"][Key], Options["context"]>
  ) :
  Key extends keyof Options["models"] ? (
    | ModelResolver<Options["models"][Key], Options["context"]>
  ) :
  Key extends keyof Options["subscriptions"] ? (
    SubscriptionResolverFn<Options["subscriptions"][Key], Options["context"]>
  ) :
  never

export function resolver<
  App extends AnyApplication,
  Key extends keyof App["_options"]["models"],
>(): (object: any) => any

export function resolver<
  App extends AnyApplication,
  Key extends keyof App["_options"]["models"],
>(
  app: App,
  name: Key,
): (object: any) => any

export function resolver<
    App extends AnyApplication,
    Key extends keyof App["_options"]["models"],
>(
  options: { app: App, name: Key, dataLoader?: boolean },
): (object: any) => any

export function resolver<
  App extends AnyApplication,
  Key extends ResolveKey<App["_options"]>,
>(
  app: App,
  resolver: DeclarationResolver<App>,
): Resolver

export function resolver<
  App extends AnyApplication,
  Key extends ResolveKey<App["_options"]>,
>(
  app: App,
  name: Key,
  resolver: ResolverFn<App["_options"], Key>,
): Resolver

export function resolver<
  App extends AnyApplication,
  Key extends keyof App["_options"]["models"],
>(
  app: App,
  options: { name: Key, dataLoader: true },
  resolver:
      | ModelDLResolver<App["_options"]["models"][Key], App["_options"]["context"]>
      | (() => ModelDLResolver<App["_options"]["models"][Key], App["_options"]["context"]>)
): Resolver

export function resolver<
  App extends AnyApplication,
  Key extends keyof App["_options"]["models"],
>(
  app: App,
  options: { name: Key, dataLoader?: false },
  resolver:
      | ModelResolver<App["_options"]["models"][Key], App["_options"]["context"]>
      | (() => ModelResolver<App["_options"]["models"][Key], App["_options"]["context"]>)
): Resolver

export function resolver<
  App extends AnyApplication,
  Key extends ResolveKey<App>,
>(
  arg0?: App | { name: string, dataLoader?: boolean },
  arg1?: Key | DeclarationResolver<App>,
  arg2?:
      | ResolverFn<App["_options"], Key>
      | ModelResolver<App["_options"][Key], App["_options"]["context"]>
      | (() => ModelResolver<App["_options"][Key], App["_options"]["context"]>)
      | ModelDLResolver<App["_options"][Key], App["_options"]["context"]>
      | (() => ModelDLResolver<App["_options"][Key], App["_options"]["context"]>)
): Resolver | ((object: any) => any) {

  if (arguments.length === 0) {
    // resolves decorator for declarations
    // syntax @resolver() class CategoryDeclarationsResolver { ... }
    return function (constructor: any) {
      constructor.prototype.resolver = {
        instanceof: "Resolver",
        type: "declaration-resolver",
        declarationType: "any",
        resolverFn: new constructor(),
      }
    }

  } else if (arguments.length === 1) {
    // resolves decorator for models with options
    // syntax @resolver({ name: "Category", dataLoader: true }) class CategoryModelResolver { ... }
    const options = arg0 as { name: string, dataLoader?: boolean }
    return function (constructor: any) {
      constructor.prototype.resolver = {
        instanceof: "Resolver",
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
        instanceof: "Resolver",
        type: "model-resolver",
        dataLoader: false,
        name,
        resolverFn: new constructor(),
      }
    }

  } else if (arguments.length === 2 && arg1 instanceof Object) {
    // resolves root declarations
    // syntax: resolver(App, { categories() { ... }, ... })
    const resolverFn = arg1 as DeclarationResolver<App>
    return {
      instanceof: "Resolver",
      type: "declaration-resolver",
      declarationType: "any",
      resolverFn
    }

  } else if (arguments.length === 3 && typeof arg1 === "string" && arg2 instanceof Function) {
    // resolves a single declaration item
    // syntax: resolver(App, "categories", (args) => { ... })
    const name = arg1 as string
    const resolverFn = arg2 as (args: any, context: any) => any
    return {
      instanceof: "Resolver",
      type: "declaration-item-resolver",
      declarationType: "any",
      name,
      resolverFn
    }

  } else if (arguments.length === 3 && typeof arg1 === "string" && arg2 instanceof Object) {
    // resolves a model
    // syntax: resolver(App, "CategoryModel", { name() { ... }, ... })

    const name = arg1 as string
    const resolverFn = arg2 as ModelResolver<any>
    return {
      instanceof: "Resolver",
      type: "model-resolver",
      dataLoader: false,
      name,
      resolverFn
    }

  } else if (arguments.length === 3 && arg1 instanceof Object && (arg2 instanceof Object || arg2 instanceof Function)) {
    // resolves a model with second argument providing model options
    // syntax: resolver(App, { name: "CategoryModel", dataLoader: true }, { name() { ... }, ... })

    const modelOptions = arg1 as { name: string, dataLoader?: boolean }
    const resolverFn = (arg2 instanceof Function ? arg2() : arg2) as ModelResolver<any>
    return {
      instanceof: "Resolver",
      type: "model-resolver",
      name: modelOptions.name,
      dataLoader: modelOptions.dataLoader || false,
      resolverFn
    }
  }

  throw new Error("Unsupported resolve parameters.")
}


export type DeepPartial<T> = {
  [P in keyof T]?:
    T[P] extends Array<infer U> ? Array<DeepPartial<U>> :
    T[P] extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> :
    DeepPartial<T[P]>;
}

export type ResolverReturnValue<T> =
// T extends ModelWithArgs<infer Type, any> ? DeepPartial<Type> | Promise<DeepPartial<Type>> :
// T extends Array<ModelWithArgs<infer Type, any>> ? DeepPartial<Type[]> | Promise<DeepPartial<Type[]>> :
    T extends Array<infer I> ? (
      I extends boolean ? boolean[] | Promise<boolean[]> :
      I extends number ? number[] | Promise<number[]> :
      I extends string ? string[] | Promise<string[]> :
      I extends Object ? DeepPartial<I>[] | null | Promise<DeepPartial<I>[] | null> :
      I[] | null | Promise<I[] | null>
    ) :
    T extends boolean ? boolean | Promise<boolean> :
    T extends number ? number | Promise<number> :
    T extends string ? string | Promise<string> :
    null extends T ? null | Promise<null> :
    // T extends object | null ? DeepPartial<T | null> | Promise<DeepPartial<T> | null> :
    T extends Object ? DeepPartial<T | null> | Promise<DeepPartial<T> | null> :
    T | null | Promise<T | null>


/**
 * Defines model resolving strategy.
 */
export type ModelResolver<Type extends ModelType, Context extends ContextList = {}> = {
  [P in keyof Type]?:
      | ((parent: Type, args: any, context: Context & DefaultContext) => ResolverReturnValue<Type[P]>)
      | ResolverReturnValue<Type[P]>
}

/**
 * Defines model resolving data-loader strategy.
 */
export type ModelDLResolver<Type extends ModelType, Context extends ContextList = {}> = {
  [P in keyof Type]?:
      | ((parent: Type[], args: any, context: Context & DefaultContext) => ResolverReturnValue<Type[P][]>)
      | ResolverReturnValue<Type[P][]>
}

export type ActionResolverFn<
  A extends Action,
  Context extends ContextList
> = (args: {
 params: A["params"]
 query: A["query"]
 header: A["header"]
 cookies: A["cookies"]
 body: A["body"]
}, context: Context & DefaultContext) =>
  A["return"] | Promise<A["return"]>


/**
 * Defines a resolver function for a specific declaration (root query or mutation).
 */
export type DeclarationResolverFn<
  Declaration extends DeclarationItem,
  Context extends ContextList
> =
  Declaration extends (args: infer Args) => infer Return ? (
      ((args: Args, context?: Context & DefaultContext) => ResolverReturnValue<Return>) | ResolverReturnValue<Return>
  ) :
  Declaration extends () => infer Return ? (
      ((context: Context & DefaultContext) => ResolverReturnValue<Return>) | ResolverReturnValue<Return>
  ) :
  unknown

export type SubscriptionResolverFn<
  Declaration extends DeclarationItem,
  Context extends ContextList
> =
  Declaration extends (args: infer Args) => infer Return ? ({
    triggers: string | string[]
    filter?: (payload: any, args: Args, context: Context & DefaultContext) => boolean | Promise<boolean>
    onSubscribe?: (args: Args, context: Context & DefaultContext) => any
    onUnsubscribe?: (args: Args, context: Context & DefaultContext) => any
  }) :
  Declaration extends () => infer Return ? ({
    triggers: string | string[]
    filter?: (payload: any, context: Context & DefaultContext) => boolean | Promise<boolean>
    onSubscribe?: (context: Context & DefaultContext) => any
    onUnsubscribe?: (context: Context & DefaultContext) => any
  }) :
  unknown

export type ResolverType = /*"input" | */"query" | "mutation" | "subscription" | "model" | "action"

export type DeclarationResolverConstructor = { new(...args: any[]): DeclarationResolver<any> }

//
// /**
//  * Defines a query / mutation / model resolver.
//  */
// export class Resolver {
//
//   /**
//    * Resolver type.
//    */
//   type: ResolverType
//
//   /**
//    * Query or mutation name, or model name.
//    */
//   name: string
//
//   /**
//    * For model resolvers,
//    * defines a blueprint resolver schema.
//    */
//   schema?: any
//
//   /**
//    * For model resolvers,
//    * defines a blueprint resolver schema
//    * (data loader version of schema).
//    */
//   dataLoaderSchema?: any // ModelDataLoaderResolverSchema<any, any>
//
//   /**
//    * For model root queries and mutations,
//    * defines a resolver function for them.
//    */
//   resolverFn?: DeclarationResolverFn<any, any> | ActionResolverFn<any, any> // | SubscriptionResolverFn<any, any>
//
//   constructor(options: Resolver) {
//     this.type = options.type
//     this.name = options.name
//     this.schema = options.schema
//     this.dataLoaderSchema = options.dataLoaderSchema
//     this.resolverFn = options.resolverFn
//   }
//
// }

//
// this.type = name.substr(0, name.indexOf(" ")).toLowerCase()// todo: make sure to validate this before
// this.route = name.substr(name.indexOf(" ") + 1).toLowerCase()

// /**
//  * Fetches the selected data.
//  *
//  * todo: instead of undefined make param optional (remove class!)
//  */
// async fetch(values: ActionType<A> extends never ? undefined : ActionType<A>): Promise<A["return"]> {
//   return executeAction(this.appProperties.client, this.route, this.type, values)
// }


// todo: request doesn't have a type here, maybe its time to more resolver stuff to the server?
// todo: create a helper createContext function for users to create contexts easily? 
