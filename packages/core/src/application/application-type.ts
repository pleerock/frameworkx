import {
  ActionFnParams,
  AnyRequestAction,
  Request,
  RequestAction,
  RequestFn,
  RequestMap,
  RequestMapItem,
  RequestMapItemOptions,
  RequestSelection,
} from "../request"
import { AnyModel, Model } from "@microframework/model"
import { DeclarationKeys, ModelOrigin } from "./application-core-types"
import {
  AnyValidationRule,
  ValidationRule,
  ValidationRuleOptions,
} from "../validation"
import {
  AnyApplication,
  AnyApplicationOptions,
  LiteralOrClass,
} from "./application-helper-types"
import {
  AnyResolver,
  ContextResolver,
  ContextResolverMetadata,
  DeclarationResolver,
  ModelDLResolver,
  ModelResolver,
  ResolveStrategy,
} from "../resolver"

/**
 * Application is a root point of the framework.
 */
export type Application<Options extends AnyApplicationOptions> = {
  /**
   * Unique type identifier.
   */
  readonly "@type": "Application"

  /**
   * Application options.
   * Typing helper. Don't use it in a runtime, its value always undefined.
   */
  readonly _options: Options

  /**
   * Gets an application model.
   */
  model<ModelName extends keyof Options["models"]>(
    name: ModelName,
  ): Model<ModelOrigin<Options["models"][ModelName]>>

  /**
   * Gets an application input.
   */
  input<InputName extends keyof Options["inputs"]>(
    name: InputName,
  ): Model<Options["inputs"][InputName]>

  /**
   * Creates a "request query".
   */
  query<QueryKey extends keyof Options["queries"]>(
    name: QueryKey,
  ): RequestMapItem<Options["queries"], QueryKey, never>

  /**
   * Creates a "request query".
   */
  query<
    QueryKey extends keyof Options["queries"],
    Declaration extends Options["queries"][QueryKey],
    Selection extends RequestSelection<Declaration>
  >(
    name: QueryKey,
    options: RequestMapItemOptions<Declaration, Selection>,
  ): RequestMapItem<Options["queries"], QueryKey, Selection>

  /**
   * Creates a "request query".
   */
  query<
    QueryKey extends keyof Options["queries"],
    Declaration extends Options["queries"][QueryKey],
    Selection extends RequestSelection<Declaration>
  >(
    name: QueryKey,
    selection: Selection,
  ): RequestMapItem<Options["queries"], QueryKey, Selection>

  /**
   * Creates a "request mutation".
   */
  mutation<MutationKey extends keyof Options["mutations"]>(
    name: MutationKey,
  ): RequestMapItem<Options["mutations"], MutationKey, never>

  /**
   * Creates a "request mutation".
   */
  mutation<
    MutationKey extends keyof Options["mutations"],
    Declaration extends Options["mutations"][MutationKey],
    Selection extends RequestSelection<Declaration>
  >(
    name: MutationKey,
    options: RequestMapItemOptions<Declaration, Selection>,
  ): RequestMapItem<Options["mutations"], MutationKey, Selection>

  /**
   * Creates a "request mutation".
   */
  mutation<
    MutationKey extends keyof Options["mutations"],
    Declaration extends Options["mutations"][MutationKey],
    Selection extends RequestSelection<Declaration>
  >(
    name: MutationKey,
    selection: Selection,
  ): RequestMapItem<Options["mutations"], MutationKey, Selection>

  /**
   * Creates a "request subscription".
   */
  subscription<SubscriptionKey extends keyof Options["subscriptions"]>(
    name: SubscriptionKey,
  ): RequestMapItem<Options["subscriptions"], SubscriptionKey, never>
  /**
   * Creates a "request subscription".
   */
  subscription<
    SubscriptionKey extends keyof Options["subscriptions"],
    Declaration extends Options["subscriptions"][SubscriptionKey],
    Selection extends RequestSelection<Declaration>
  >(
    name: SubscriptionKey,
    options: RequestMapItemOptions<Declaration, Selection>,
  ): RequestMapItem<Options["subscriptions"], SubscriptionKey, Selection>

  /**
   * Creates a "request subscription".
   */
  subscription<
    SubscriptionKey extends keyof Options["subscriptions"],
    Declaration extends Options["subscriptions"][SubscriptionKey],
    Selection extends RequestSelection<Declaration>
  >(
    name: SubscriptionKey,
    selection: Selection,
  ): RequestMapItem<Options["subscriptions"], SubscriptionKey, Selection>

  /**
   * Creates a "request action".
   */
  action<
    ActionKey extends keyof Options["actions"],
    Action extends Options["actions"][ActionKey]
  >(
    name: ActionKey,
    ...args: ActionFnParams<Action>
  ): RequestAction<Application<Options>, ActionKey, Action>

  /**
   * Creates action request.
   */
  request<T extends AnyRequestAction>(map: T): Request<T>

  /**
   * Creates a graphql request.
   */
  request<T extends RequestMap>(name: string, map: T): Request<T>

  /**
   * Creates a request.
   */
  request<T extends RequestMap | AnyRequestAction>(): Request<T>

  /**
   * A graphql request factory function.
   */
  requestFn<Map extends RequestMap>(
    name: string,
    map: Map,
  ): RequestFn<Application<Options>, Request<Map>>

  /**
   * Creates a new validation rule for a given App's model.
   */
  validationRule<Key extends keyof Options["models"]>(
    name: Key,
    options: ValidationRuleOptions<Options["models"][Key], Options["context"]>,
  ): ValidationRule<Options["models"][Key], Options["context"]>

  /**
   * Creates a new validation rule for a given App's input.
   */
  validationRule<Key extends keyof Options["inputs"]>(
    name: Key,
    options: ValidationRuleOptions<Options["inputs"][Key], Options["context"]>,
  ): ValidationRule<Options["inputs"][Key], Options["context"]>

  /**
   * Creates a new validation rule for a given model.
   */
  validationRule<T>(
    name: string | Model<T>,
    options: ValidationRuleOptions<T, any>,
  ): ValidationRule<T, any>

  /**
   * Creates a validation rule.
   */
  validationRule(): AnyValidationRule

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
   *
   * Class syntax also supported.
   */
  resolver(
    resolver: LiteralOrClass<DeclarationResolver<Application<Options>>>,
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
  resolver<Key extends DeclarationKeys<Options>>(
    name: Key,
    resolver: ResolveStrategy<Options, Key>,
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
  resolver<Model extends AnyModel>(
    model: Model,
    resolver:
      | LiteralOrClass<ModelResolver<Model["type"], Options["context"]>>
      | (() => LiteralOrClass<
          ModelResolver<Model["type"], Options["context"]>
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
  resolver<Key extends keyof Options["models"]>(
    options: { name: Key; dataLoader: true },
    resolver:
      | LiteralOrClass<
          ModelDLResolver<Options["models"][Key], Options["context"]>
        >
      | (() => LiteralOrClass<
          ModelDLResolver<Options["models"][Key], Options["context"]>
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
  resolver<Model extends AnyModel>(
    options: { model: Model; dataLoader: true },
    resolver:
      | LiteralOrClass<ModelDLResolver<Model["type"], Options["context"]>>
      | (() => LiteralOrClass<
          ModelDLResolver<Model["type"], Options["context"]>
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
  resolver<Key extends keyof Options["models"]>(
    options: { name: Key; dataLoader?: false },
    resolver:
      | LiteralOrClass<
          ModelResolver<Options["models"][Key], Options["context"]>
        >
      | (() => LiteralOrClass<
          ModelResolver<Options["models"][Key], Options["context"]>
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
  resolver<App extends AnyApplication, Model extends AnyModel>(
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
  resolver(): AnyResolver

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
  contextResolver(
    resolver: LiteralOrClass<ContextResolver<Options["context"]>>,
  ): ContextResolverMetadata
}
