import { Action, AnyApplication, AnyApplicationOptions, ContextList, DeclarationItem, ModelType } from "../app"
import { ActionArgs, DefaultContext, ResolveKey, ResolverReturnValue } from "./index"

/**
 * Type for class-based declaration resolvers.
 */
export type DeclarationResolverConstructor = {
  new(...args: any[]): DeclarationResolver<any> // todo: shoudn't ModelResolver<any> be here?
}

/**
 * Defines a model resolving strategy.
 */
export type ModelResolver<Type extends ModelType, Context extends ContextList = {}> = {
    [P in keyof Type]?:
        | ((parent: Type, args: any, context: Context & DefaultContext) => ResolverReturnValue<Type[P]>)
        | ResolverReturnValue<Type[P]>
}

/**
 * Defines a model resolving data-loader strategy.
 */
export type ModelDLResolver<Type extends ModelType, Context extends ContextList = {}> = {
    [P in keyof Type]?:
        | ((parent: Type[], args: any, context: Context & DefaultContext) => ResolverReturnValue<Type[P][]>)
        | ResolverReturnValue<Type[P][]>
}

/**
 * Defines a context resolving strategy.
 */
export type ContextResolver<Context extends ContextList> = {
    [P in keyof Context]: (options: { request: any }) => Context[P] | Promise<Context[P]>
}

/**
 * Type to provide resolvers for declarations (queries, mutations, subscriptions and actions).
 */
export type DeclarationResolver<
    App extends AnyApplication | AnyApplicationOptions
> =
  App extends AnyApplication ? (
    {
      [P in
        | keyof App["_options"]["actions"]
        | keyof App["_options"]["models"]
        | keyof App["_options"]["queries"]
        | keyof App["_options"]["mutations"]
        | keyof App["_options"]["subscriptions"]
      ]?: ResolveStrategy<App["_options"], P>
    }
  ) : App extends AnyApplicationOptions ? (
      {
        [P in
          | keyof App["actions"]
          | keyof App["models"]
          | keyof App["queries"]
          | keyof App["mutations"]
          | keyof App["subscriptions"]
        ]?: ResolveStrategy<App, P>
      }
  ) : unknown

/**
 * Maps to a resolving strategy of a particular app's declaration.
 */
export type ResolveStrategy<
    Options extends AnyApplicationOptions,
    Key extends ResolveKey<Options>
> =
  Key extends keyof Options["queries"] ? (
    QueryMutationItemResolver<Options["queries"][Key], Options["context"]>
  ) :
  Key extends keyof Options["mutations"] ? (
    QueryMutationItemResolver<Options["mutations"][Key], Options["context"]>
  ) :
  Key extends keyof Options["models"] ? (
    | ModelResolver<Options["models"][Key], Options["context"]>
  ) :
  Key extends keyof Options["subscriptions"] ? (
    SubscriptionItemResolver<Options["subscriptions"][Key], Options["context"]>
  ) :
  Key extends keyof Options["actions"] ? (
    ActionItemResolver<Options["actions"][Key], Options["context"]>
  ) :
  unknown

/**
 * Defines a query or mutation resolving strategy.
 */
export type QueryMutationItemResolver<
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

/**
 * Defines a subscription resolving strategy.
 */
export type SubscriptionItemResolver<
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

/**
 * Defines an action resolving strategy.
 */
export type ActionItemResolver<A extends Action, Context extends ContextList> =
    (args: ActionArgs<A>, context: Context & DefaultContext) => A["return"] | Promise<A["return"]>
