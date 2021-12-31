import {
  AnyAction,
  AnyApplication,
  AnyApplicationOptions,
  ContextList,
  DeclarationKeys,
  ForcedType,
  GraphQLDeclarationItem,
  ModelType,
} from "../application"
import {
  ActionArgs,
  DefaultContext,
  ResolverReturnValue,
  ResolverReturnValueArray,
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
        input: any, // input can have a type when ModelWithArgs will be properly implemented
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
        parents: Type[],
        input: any, // input can have a type when ModelWithArgs will be properly implemented
        context: Context & DefaultContext,
      ) => ResolverReturnValueArray<Type[P]>)
    | ResolverReturnValueArray<Type[P]>
}

/**
 * Defines a context resolving strategy.
 */
export type ContextResolver<Context extends ContextList> = {
  [P in keyof Context]: (
    defaultContext: DefaultContext,
  ) => Context[P] | Promise<Context[P]>
}

/**
 * Defines a query or mutation resolving strategy.
 */
export type QueryMutationDeclarationItemResolver<
  Declaration extends GraphQLDeclarationItem<any>,
  Context extends ContextList
> = Parameters<Declaration> extends []
  ?
      | ((
          context: Context & DefaultContext,
        ) => ResolverReturnValue<ReturnType<Declaration>>)
      | ResolverReturnValue<ReturnType<Declaration>>
  : Declaration extends (input: infer Input) => infer Return
  ?
      | ((
          input: Input,
          context: Context & DefaultContext,
        ) => ResolverReturnValue<Return>)
      | ResolverReturnValue<Return>
  : unknown

/**
 * Defines a subscription resolving strategy.
 */
export type SubscriptionDeclarationItemResolver<
  Declaration extends GraphQLDeclarationItem<any>,
  Context extends ContextList
> = Parameters<Declaration> extends []
  ? {
      triggers: string | string[]
      filter?: (
        payload: ReturnType<Declaration>,
        context: Context & DefaultContext,
      ) => boolean | Promise<boolean>
      onSubscribe?: (context: Context & DefaultContext) => any
      onUnsubscribe?: (context: Context & DefaultContext) => any
    }
  : Declaration extends (input: infer Input) => infer Return
  ? {
      triggers: string | string[]
      filter?: (
        payload: Return,
        input: Input,
        context: Context & DefaultContext,
      ) => boolean | Promise<boolean>
      onSubscribe?: (input: Input, context: Context & DefaultContext) => any
      onUnsubscribe?: (input: Input, context: Context & DefaultContext) => any
    }
  : unknown

/**
 * Defines action resolving strategy.
 */
export type ActionDeclarationItemResolver<
  A extends AnyAction,
  Context extends ContextList
> = (
  args: ActionArgs<A>,
  context: Context & DefaultContext,
) => A["return"] | Promise<A["return"]>

/**
 * Type to provide resolvers for declarations (queries, mutations, subscriptions and actions).
 */
export type DeclarationResolver<App extends AnyApplication> = {
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

/**
 * Maps to a resolving strategy of a particular app's declaration.
 */
export type ResolveStrategy<
  Options extends AnyApplicationOptions,
  Key extends DeclarationKeys<Options>
> = Key extends keyof Options["queries"]
  ? QueryMutationDeclarationItemResolver<
      ForcedType<Options["queries"][Key], GraphQLDeclarationItem<any>>,
      ForcedType<Options["context"], ContextList>
    >
  : Key extends keyof Options["mutations"]
  ? QueryMutationDeclarationItemResolver<
      ForcedType<Options["mutations"][Key], GraphQLDeclarationItem<any>>,
      ForcedType<Options["context"], ContextList>
    >
  : Key extends keyof Options["models"]
  ? ModelResolver<
      Options["models"][Key],
      ForcedType<Options["context"], ContextList>
    >
  : Key extends keyof Options["subscriptions"]
  ? SubscriptionDeclarationItemResolver<
      ForcedType<Options["subscriptions"][Key], GraphQLDeclarationItem<any>>,
      ForcedType<Options["context"], ContextList>
    >
  : Key extends keyof Options["actions"]
  ? ActionDeclarationItemResolver<
      ForcedType<Options["actions"][Key], AnyAction>,
      ForcedType<Options["context"], ContextList>
    >
  : unknown
