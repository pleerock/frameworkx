import {Action, ContextList, DeclarationItem, DeclarationList, Model} from "../app";

/**
 * Default framework properties applied to the user context.
 */
export type DefaultContext = {
  request: any
  response: any
}

export type DeepPartial<T> = {
  [P in keyof T]?:
    T[P] extends Array<infer U> ? Array<DeepPartial<U>> :
    T[P] extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> :
    DeepPartial<T[P]>;
}

export type ResolverReturnValue<T> =
  T extends Model<infer Blueprint, any> ? DeepPartial<Blueprint> | Promise<DeepPartial<Blueprint>> :
  T extends Array<Model<infer Blueprint, any>> ? DeepPartial<Blueprint[]> | Promise<DeepPartial<Blueprint[]>> :
  T extends object ? DeepPartial<T> | Promise<DeepPartial<T>> :
  T extends boolean ? boolean | Promise<boolean> :
  T extends number ? number | Promise<number> :
  T extends string ? string | Promise<string> :
  T | Promise<T>


export type Declaration<
    Queries extends DeclarationList,
    Mutations extends DeclarationList,
    Subscriptions extends DeclarationList,
    > = {
  queries?: Queries
  mutations?: Mutations
  subscriptions?: Subscriptions
}

export type ContextType = { [key: string]: any }

export type DeclarationResolver<
    D extends Declaration<any, any, any>,
    Context = ContextType
    > = {
  [P in keyof D["queries"]]: DeclarationResolverFn<D["queries"][P], Context>
} & {
  [P in keyof D["mutations"]]: DeclarationResolverFn<D["mutations"][P], Context>
} & {
  [P in keyof D["subscriptions"]]: DeclarationResolverFn<D["subscriptions"][P], Context>
}

/**
 * Defines a resolver schema for the model (based on blueprint) properties.
 */
export type ModelResolverSchema<
  M extends Model<any, any>,
  Context extends ContextList
> = {
  [P in keyof M["blueprint"]]?:
    M extends { blueprint: infer Blueprint, args: infer Args } ? (
      Args[P] extends object ? (
        | ((parent: Blueprint, args: Args[P], context: Context & DefaultContext) => ResolverReturnValue<Blueprint[P]>)
        | ResolverReturnValue<Blueprint[P]>
      ) : (
        | ((parent: Blueprint, context: Context & DefaultContext) => ResolverReturnValue<Blueprint[P]>)
        | ResolverReturnValue<Blueprint[P]>
        )
      ) :
    M extends { blueprint: infer Blueprint } ? (
      | ((parent: Blueprint, context: Context & DefaultContext) => ResolverReturnValue<Blueprint[P]>)
      | ResolverReturnValue<Blueprint[P]>
    ) :
    unknown
}

/**
 * Defines a resolver schema for the model (based on blueprint) properties that uses data loader.
 *
 * todo: returned value properties must be optional
 */
export type ModelDataLoaderResolverSchema<
  M extends Model<any, any>,
  Context extends ContextList
> = {
  [P in keyof M["blueprint"]]?:
    M extends { blueprint: infer Blueprint, args: infer Args } ? (
      Args[P] extends object ? (
        | ((parent: Blueprint[], args: Args[P], context: Context & DefaultContext) => ResolverReturnValue<Blueprint[P][]>)
        | ResolverReturnValue<Blueprint[P][]>
      ) : (
        | ((parent: Blueprint[], context: Context & DefaultContext) => ResolverReturnValue<Blueprint[P][]>)
        | ResolverReturnValue<Blueprint[P][]>
      )
      ) :
      M extends { blueprint: infer Blueprint } ? (
        | ((parent: Blueprint[], context: Context & DefaultContext) => ResolverReturnValue<Blueprint[P][]>)
        | ResolverReturnValue<Blueprint[P][]>
      ) : unknown
}

export type ActionResolverFn<
  A extends Action,
  Context extends ContextList
> = (args: {
 params: A["params"] // extends AnyRootInput ? AnyInputType<A["params"]> : never,
 query: A["query"] // extends AnyRootInput ? AnyInputType<A["query"]> : never,
 header: A["header"] // extends AnyRootInput ? AnyInputType<A["header"]> : never,
 cookies: A["cookies"] // extends AnyRootInput ? AnyInputType<A["cookies"]> : never,
 body: A["body"] // extends AnyRootInput ? AnyInputType<A["body"]> : never,
}, context: Context & DefaultContext) =>
  A["return"] | Promise<A["return"]>


export type SubscriptionResolverFn<
  Declaration extends DeclarationItem,
  Context extends ContextList
  > = {
  triggers: string | string[]
  filter?: (payload: any, args: any, context: any) => boolean | Promise<boolean>
  onSubscribe?: (args: any, context: any) => any
  onUnsubscribe?: (args: any, context: any) => any
}

/**
 * Defines a resolver function for a specific declaration (root query or mutation).
 */
export type DeclarationResolverFn<
  Declaration extends DeclarationItem,
  Context extends ContextList
> =
  Declaration extends (args: infer Args) => infer Return ? (
      (args: Args, context: Context & DefaultContext) => ResolverReturnValue<Return>
  ) :
  Declaration extends () => infer Return ? (
      (context: Context & DefaultContext) => ResolverReturnValue<Return>
  ) :
  unknown

export type ResolverType = /*"input" | */"query" | "mutation" | "subscription" | "model" | "action"

/**
 * Defines a query / mutation / model resolver.
 */
export class Resolver {

  /**
   * Resolver type.
   */
  type: ResolverType

  /**
   * Query or mutation name, or model name.
   */
  name: string

  /**
   * For model resolvers,
   * defines a blueprint resolver schema.
   */
  schema?: ModelResolverSchema<any, any>

  /**
   * For model resolvers,
   * defines a blueprint resolver schema
   * (data loader version of schema).
   */
  dataLoaderSchema?: ModelDataLoaderResolverSchema<any, any>

  /**
   * For model root queries and mutations,
   * defines a resolver function for them.
   */
  resolverFn?: DeclarationResolverFn<any, any> | ActionResolverFn<any, any> | SubscriptionResolverFn<any, any>

  constructor(options: Resolver) {
    this.type = options.type
    this.name = options.name
    this.schema = options.schema
    this.dataLoaderSchema = options.dataLoaderSchema
    this.resolverFn = options.resolverFn
  }

}

// todo: request doesn't have a type here, maybe its time to more resolver stuff to the server?
// todo: create a helper createContext function for users to create contexts easily? 
