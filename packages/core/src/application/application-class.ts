import { AnyApplicationOptions } from "./application-options"
import {
  action,
  mutation,
  query,
  Request,
  request,
  RequestAction,
  RequestActionItemOptions,
  RequestGraphQLDeclarationItemOptions,
  RequestMap,
  RequestMapForAction,
  RequestMutation,
  RequestQuery,
  RequestSelectionSchema,
  RequestSubscription,
  subscription,
} from "../request"
import { AnyModel, Model } from "@microframework/model"
import { ModelOrigin } from "./application-core-types"
import {
  AnyValidationRule,
  ValidationRule,
  validationRule,
  ValidationRuleOptions,
} from "../validation"
import { AnyApplication } from "./application-helper-types"
import {
  contextResolver,
  ContextResolver,
  DeclarationResolver,
  ModelDLResolver,
  ModelResolver,
  ResolveKey,
  resolver,
  ResolverMetadata,
  ResolveStrategy,
} from "../resolver"

/**
 * Application is a root point of the framework.
 */
export class Application<Options extends AnyApplicationOptions> {
  /**
   * Unique type identifier.
   */
  readonly typeof: "Application" = "Application"

  /**
   * Application options.
   */
  readonly _options!: Options

  /**
   * Gets application model.
   */
  model<ModelName extends keyof this["_options"]["models"]>(
    name: ModelName,
  ): Model<ModelOrigin<this["_options"]["models"][ModelName]>> {
    return new Model<ModelOrigin<this["_options"]["models"][ModelName]>>(
      name as string,
    )
  }

  /**
   * Gets application input.
   */
  input<InputName extends keyof this["_options"]["inputs"]>(
    name: InputName,
  ): Model<this["_options"]["inputs"][InputName]> {
    return new Model<this["_options"]["inputs"][InputName]>(name as string)
  }

  /**
   * Creates a "request action".
   */
  action<
    ActionKey extends keyof this["_options"]["actions"],
    Declaration extends this["_options"]["actions"][ActionKey]
  >(
    name: ActionKey,
    options: RequestActionItemOptions<
      this,
      this["_options"]["actions"][ActionKey]
    >,
  ): RequestAction<this, ActionKey, Declaration> {
    return (action as any)(this, ...arguments)
  }

  /**
   * Creates a "request query".
   */
  query<
    QueryKey extends keyof this["_options"]["queries"],
    Declaration extends this["_options"]["queries"][QueryKey],
    Selection extends RequestSelectionSchema<
      this,
      this["_options"]["queries"][QueryKey]
    >
  >(
    name: QueryKey,
    options: RequestGraphQLDeclarationItemOptions<
      this,
      this["_options"]["queries"][QueryKey],
      Selection
    >,
  ): RequestQuery<this, QueryKey, Declaration, Selection> {
    return (query as any)(this, ...arguments)
  }

  /**
   * Creates a "request mutation".
   */
  mutation<
    MutationKey extends keyof this["_options"]["mutations"],
    Declaration extends this["_options"]["mutations"][MutationKey],
    Selection extends RequestSelectionSchema<
      this,
      this["_options"]["mutations"][MutationKey]
    >
  >(
    name: MutationKey,
    options: RequestGraphQLDeclarationItemOptions<
      this,
      this["_options"]["mutations"][MutationKey],
      Selection
    >,
  ): RequestMutation<this, MutationKey, Declaration, Selection> {
    return (mutation as any)(this, ...arguments)
  }

  /**
   * Creates a "request subscription".
   */
  subscription<
    SubscriptionKey extends keyof this["_options"]["subscriptions"],
    Declaration extends this["_options"]["subscriptions"][SubscriptionKey],
    Selection extends RequestSelectionSchema<
      this,
      this["_options"]["subscriptions"][SubscriptionKey]
    >
  >(
    name: SubscriptionKey,
    options: RequestGraphQLDeclarationItemOptions<
      this,
      this["_options"]["subscriptions"][SubscriptionKey],
      Selection
    >,
  ): RequestSubscription<this, SubscriptionKey, Declaration, Selection> {
    return (subscription as any)(this, ...arguments)
  }

  /**
   * Creates action request.
   */
  request<T extends RequestMapForAction>(map: T): Request<T>

  /**
   * Creates a graphql request.
   */
  request<T extends RequestMap>(name: string, map: T): Request<T>

  /**
   * Creates a request.
   */
  request<T extends RequestMap | RequestMapForAction>(): Request<T> {
    return (request as any)(...arguments)
  }

  /**
   * Creates a new validation rule for a given App's model.
   */
  validationRule<Key extends keyof this["_options"]["models"]>(
    name: Key,
    options: ValidationRuleOptions<
      this["_options"]["models"][Key],
      this["_options"]["context"]
    >,
  ): ValidationRule<
    this["_options"]["models"][Key],
    this["_options"]["context"]
  >

  /**
   * Creates a new validation rule for a given App's input.
   */
  validationRule<Key extends keyof this["_options"]["inputs"]>(
    name: Key,
    options: ValidationRuleOptions<
      this["_options"]["inputs"][Key],
      this["_options"]["context"]
    >,
  ): ValidationRule<
    this["_options"]["inputs"][Key],
    this["_options"]["context"]
  >

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
  validationRule(): AnyValidationRule {
    return (validationRule as any)(this, ...arguments)
  }

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
  resolver<Key extends ResolveKey<this["_options"]>>(
    resolver: DeclarationResolver<this>,
  ): ResolverMetadata

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
  resolver<Key extends ResolveKey<this["_options"]>>(
    name: Key,
    resolver: ResolveStrategy<this["_options"], Key>,
  ): ResolverMetadata

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
      | ModelResolver<Model["type"], this["_options"]["context"]>
      | (() => ModelResolver<Model["type"], this["_options"]["context"]>),
  ): ResolverMetadata

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
  resolver<Key extends keyof this["_options"]["models"]>(
    options: { name: Key; dataLoader: true },
    resolver:
      | ModelDLResolver<
          this["_options"]["models"][Key],
          this["_options"]["context"]
        >
      | (() => ModelDLResolver<
          this["_options"]["models"][Key],
          this["_options"]["context"]
        >),
  ): ResolverMetadata

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
      | ModelDLResolver<Model["type"], this["_options"]["context"]>
      | (() => ModelDLResolver<Model["type"], this["_options"]["context"]>),
  ): ResolverMetadata

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
  resolver<Key extends keyof this["_options"]["models"]>(
    options: { name: Key; dataLoader?: false },
    resolver:
      | ModelResolver<
          this["_options"]["models"][Key],
          this["_options"]["context"]
        >
      | (() => ModelResolver<
          this["_options"]["models"][Key],
          this["_options"]["context"]
        >),
  ): ResolverMetadata

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
      | ModelResolver<Model["type"], App["_options"]["context"]>
      | (() => ModelResolver<Model["type"], App["_options"]["context"]>),
  ): ResolverMetadata

  /**
   * Creates a new resolver metadata to resolve queries, mutations, subscriptions, actions or models.
   */
  resolver(): ResolverMetadata {
    return (resolver as any)(this, ...arguments)
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
  contextResolver(resolver: ContextResolver<this["_options"]["context"]>) {
    return contextResolver(this, resolver)
  }
}
