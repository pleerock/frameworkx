import {
  AnyAction,
  AnyApplication,
  AnyApplicationOptions,
  ApplicationDeclarations,
  ContextList,
  ForcedType,
  GraphQLDeclarationItem,
  ModelType,
} from "../application"
import {
  ActionArgs,
  DefaultContext,
  ResolveKey,
  ResolverReturnValue,
} from "./index"

/**
 * Defines a model resolving strategy.
 */
export type ModelResolver<
  Type extends ModelType,
  Context extends ContextList = {}
> = {
  [P in keyof Type]?:
    | ((
        parent: Type,
        args: any,
        context: Context & DefaultContext,
      ) => ResolverReturnValue<Type[P]>)
    | ResolverReturnValue<Type[P]>
}

/**
 * Defines a model resolving data-loader strategy.
 */
export type ModelDLResolver<
  Type extends ModelType,
  Context extends ContextList = {}
> = {
  [P in keyof Type]?:
    | ((
        parent: Type[],
        args: any,
        context: Context & DefaultContext,
      ) => ResolverReturnValue<Type[P][]>)
    | ResolverReturnValue<Type[P][]>
}

/**
 * Defines a context resolving strategy.
 */
export type ContextResolver<Context extends ContextList> = {
  [P in keyof Context]: (
    options: DefaultContext,
  ) => Context[P] | Promise<Context[P]>
}

/**
 * Type to provide resolvers for declarations (queries, mutations, subscriptions and actions).
 */
export type DeclarationResolver<
  App extends AnyApplication | AnyApplicationOptions
> = App extends AnyApplication
  ? {
      [P in
        | keyof App["_options"]["actions"]
        | keyof App["_options"]["models"]
        | keyof App["_options"]["queries"]
        | keyof App["_options"]["mutations"]
        | keyof App["_options"]["subscriptions"]]?: ResolveStrategy<
        App["_options"],
        P
      >
    }
  : App extends AnyApplicationOptions
  ? {
      [P in
        | keyof App["actions"]
        | keyof App["models"]
        | keyof App["queries"]
        | keyof App["mutations"]
        | keyof App["subscriptions"]]?: ResolveStrategy<App, P>
    }
  : unknown

/**
 * Maps to a resolving strategy of a particular app's declaration.
 */
export type ResolveStrategy<
  Options extends AnyApplicationOptions,
  Key extends ResolveKey<Options>
> = Key extends keyof Options["queries"]
  ? QueryMutationItemResolver<
      ForcedType<Options["queries"][Key], GraphQLDeclarationItem<any>>,
      ForcedType<Options["context"], ContextList>
    >
  : Key extends keyof Options["mutations"]
  ? QueryMutationItemResolver<
      ForcedType<Options["mutations"][Key], GraphQLDeclarationItem<any>>,
      ForcedType<Options["context"], ContextList>
    >
  : Key extends keyof Options["models"]
  ? ModelResolver<
      Options["models"][Key],
      ForcedType<Options["context"], ContextList>
    >
  : Key extends keyof Options["subscriptions"]
  ? SubscriptionItemResolver<
      ForcedType<Options["subscriptions"][Key], GraphQLDeclarationItem<any>>,
      ForcedType<Options["context"], ContextList>
    >
  : Key extends keyof Options["actions"]
  ? ActionItemResolver<
      ForcedType<Options["actions"][Key], AnyAction>,
      ForcedType<Options["context"], ContextList>
    >
  : unknown

/**
 * Defines a query or mutation resolving strategy.
 */
export type QueryMutationItemResolver<
  Declaration extends GraphQLDeclarationItem<any>,
  Context extends ContextList
> = Parameters<Declaration> extends []
  ?
      | ((
          context: Context & DefaultContext,
        ) => ResolverReturnValue<ReturnType<Declaration>>)
      | ResolverReturnValue<ReturnType<Declaration>>
  : Declaration extends (args: infer Args) => infer Return
  ?
      | ((
          args: Args,
          context: Context & DefaultContext,
        ) => ResolverReturnValue<Return>)
      | ResolverReturnValue<Return>
  : unknown

/**
 * Defines a subscription resolving strategy.
 */
export type SubscriptionItemResolver<
  Declaration extends GraphQLDeclarationItem<any>,
  Context extends ContextList
> = Parameters<Declaration> extends []
  ? {
      triggers: string | string[]
      filter?: (
        payload: any,
        context: Context & DefaultContext,
      ) => boolean | Promise<boolean>
      onSubscribe?: (context: Context & DefaultContext) => any
      onUnsubscribe?: (context: Context & DefaultContext) => any
    }
  : Declaration extends (args: infer Args) => infer Return
  ? {
      triggers: string | string[]
      filter?: (
        payload: any,
        args: Args,
        context: Context & DefaultContext,
      ) => boolean | Promise<boolean>
      onSubscribe?: (args: Args, context: Context & DefaultContext) => any
      onUnsubscribe?: (args: Args, context: Context & DefaultContext) => any
    }
  : unknown

/**
 * Defines action resolving strategy.
 */
export type ActionItemResolver<
  A extends AnyAction,
  Context extends ContextList
> = (
  args: ActionArgs<A>,
  context: Context & DefaultContext,
) => A["return"] | Promise<A["return"]>

/**
 * Gets args (input) for a given application declaration.
 */
export type DeclarationArgs<
  App extends AnyApplication,
  Method extends keyof ApplicationDeclarations<App>
> = App["_options"]["queries"][Method] extends never
  ? App["_options"]["mutations"][Method] extends never
    ? App["_options"]["subscriptions"][Method] extends never
      ? App["_options"]["actions"][Method] extends never
        ? never
        : Parameters<App["_options"]["actions"][Method]>[0]
      : Parameters<App["_options"]["subscriptions"][Method]>[0]
    : Parameters<App["_options"]["mutations"][Method]>[0]
  : Parameters<App["_options"]["queries"][Method]>[0]
