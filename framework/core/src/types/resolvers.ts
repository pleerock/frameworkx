import { Action, ContextList, DeclarationItem, DeclarationList, ArgsOfModel, ModelWithArgs, ModelType } from "../app";

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
  // T extends ModelWithArgs<infer Type, any> ? DeepPartial<Type> | Promise<DeepPartial<Type>> :
  // T extends Array<ModelWithArgs<infer Type, any>> ? DeepPartial<Type[]> | Promise<DeepPartial<Type[]>> :
  T extends Array<infer I> ? (
    I extends boolean ? boolean[] | Promise<boolean[]> :
    I extends number ? number[] | Promise<number[]> :
    I extends string ? string[] | Promise<string[]> :
    // I extends object | null ? DeepPartial<I | null>[] | Promise<DeepPartial<I> | null>[] :
    I extends Object ? DeepPartial<I>[] | Promise<DeepPartial<I>[]> :
    I[] | Promise<I[]>
  ) :
  T extends boolean ? boolean | Promise<boolean> :
  T extends number ? number | Promise<number> :
  T extends string ? string | Promise<string> :
  null extends T ? null | Promise<null> :
  // T extends object | null ? DeepPartial<T | null> | Promise<DeepPartial<T> | null> :
  T extends Object ? DeepPartial<T> | Promise<DeepPartial<T>> :
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

export type DeclarationResolverConstructor = { new(): DeclarationResolver<any> }

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

//
// this.type = name.substr(0, name.indexOf(" ")).toLowerCase()// todo: make sure to validate this before
// this.route = name.substr(name.indexOf(" ") + 1).toLowerCase()

//
// return new Resolver({
//   type: "model",
//   name: this.name,
//   schema: schema,
//   dataLoaderSchema: dataLoaderSchema,
// })

// resolve(resolver: SubscriptionResolverFn<Declaration, Context>): Resolver {
// return new Resolver({
//   type: "subscription",
//   name: this.name,
//   resolverFn: resolver
// })

/**
 * Defines a resolver for the current declaration.
 */
// resolve(resolver: ActionResolverFn<A, Context>): Resolver {
//   return new Resolver({
//     type: "action",
//     name: this.name,
//     resolverFn: resolver as any
//   })
// }
//
// /**
//  * Fetches the selected data.
//  *
//  * todo: instead of undefined make param optional (remove class!)
//  */
// async fetch(values: ActionType<A> extends never ? undefined : ActionType<A>): Promise<A["return"]> {
//   return executeAction(this.appProperties.client, this.route, this.type, values)
// }


// export function declaration(name: string, resolver: () => ) {
//
// }
//
// declaration<CategoryDeclaration>("category", args => {
//
// })

/**
 * Defines a resolver for the current declaration.
 */
// resolve(resolver: DeclarationResolverFn<Declaration, AppOptions["context"]>): Resolver {
//   return new Resolver({
//     type: this.type,
//     name: this.name,
//     resolverFn: resolver as any
//   })
// }

/**
 * Defines resolving strategy for mixed model (either model type either model type with args).
 */
export type MixedModelResolver<
  T extends ModelWithArgs<ModelType, ArgsOfModel<ModelType>> | ModelType,
  Context extends ContextList = any
> =
  T extends ModelWithArgs<infer Type, infer Args> ?
    ModelResolver<Type, Args, Context> // | ModelDLResolver<Type, Args, Context>
  :
    ModelResolver<T, unknown, Context> // | ModelDLResolver<T, never, Context>

/**
 * Defines model resolving strategy.
 */
export type ModelResolver<
  Type extends ModelType,
  Args extends ArgsOfModel<Type> | unknown,
  Context extends ContextList
> = {
  [P in keyof Type]?:
    Args extends ArgsOfModel<Type> ? (
      | ((parent: Type, args: Args[P], context: Context & DefaultContext) => ResolverReturnValue<Type[P]>)
      | ResolverReturnValue<Type[P]>
    ) : (
      | ((parent: Type, context: Context & DefaultContext) => ResolverReturnValue<Type[P]>)
      | ResolverReturnValue<Type[P]>
    )
}

/**
 * Defines model resolving data-loader strategy.
 */
export type ModelDLResolver<
  Type extends ModelType,
  Args extends ArgsOfModel<Type> | never,
  Context extends ContextList
> = {
  [P in keyof Type]?:
    Args extends ArgsOfModel<Type> ? (
      | ((parent: Type[], args: Args[P], context: Context & DefaultContext) => ResolverReturnValue<Type[P][]>)
      | ResolverReturnValue<Type[P][]>
    ) : (
      | ((parent: Type[], context: Context & DefaultContext) => ResolverReturnValue<Type[P][]>)
      | ResolverReturnValue<Type[P][]>
    )
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
  schema?: any

  /**
   * For model resolvers,
   * defines a blueprint resolver schema
   * (data loader version of schema).
   */
  dataLoaderSchema?: any // ModelDataLoaderResolverSchema<any, any>

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
