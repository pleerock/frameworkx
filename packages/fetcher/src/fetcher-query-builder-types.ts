import {
  GraphQLDeclarationList,
  NonArray,
  RequestMap,
  RequestMapItem,
  RequestMapOriginType,
  RequestMapReturnType,
  RequestSelection,
  ReturnTypeOptional,
} from "@microframework/core"
import Observable from "zen-observable-ts"

/**
 * Initiates a query building for a GraphQL Query.
 */
export type FetcherQueryBuilder<
  Queries extends GraphQLDeclarationList,
  Map extends RequestMap
> = {
  /**
   * Add a new entry into GraphQL query.
   * Using this operator you can combine queries to a different GraphQL root declarations
   * in a single HTTP request.
   */
  add<Name extends string>(name: Name): FetcherQueryMethods<Queries, Name, Map>
}

/**
 * Initiates a query building for a GraphQL Mutation.
 */
export type FetcherMutationBuilder<
  Mutations extends GraphQLDeclarationList,
  Map extends RequestMap
> = {
  /**
   * Add a new entry into GraphQL query.
   * Using this operator you can combine mutations to a different GraphQL root declarations
   * in a single HTTP request.
   */
  add<Name extends string>(
    name: Name,
  ): FetcherMutationMethods<Mutations, Name, Map>
}

/**
 * Initiates a query building for a GraphQL Subscription.
 */
export type FetcherSubscriptionBuilder<
  Subscriptions extends GraphQLDeclarationList,
  Map extends RequestMap
> = {
  /**
   * Add a new entry into GraphQL query.
   * Using this operator you can combine subscriptions to a different GraphQL root declarations
   * in a single HTTP request.
   */
  add<Name extends string>(
    name: Name,
  ): FetcherSubscriptionMethods<Subscriptions, Name, Map>
}

/**
 * Last step of "Query" query building is a request execution.
 */
export type FetcherQueryExecutor<
  Queries extends GraphQLDeclarationList,
  Map extends RequestMap
> = FetcherQueryBuilder<Queries, Map> & {
  /**
   * Executes a query and returns a Response object.
   */
  response(): Promise<Response>

  /**
   * Executes a query and returns the data out of response.
   */
  fetch(): Promise<{ data: RequestMapReturnType<Map>; errors?: any[] }>

  /**
   * Executes a query and returns the data out of response.
   * Unsafe version returns original root declaration type.
   */
  fetchUnsafe(): Promise<{ data: RequestMapOriginType<Map>; errors?: any[] }>
}

/**
 * Last step of "Mutation" query building is a request execution.
 */
export type FetcherMutationExecutor<
  Mutations extends GraphQLDeclarationList,
  Map extends RequestMap
> = FetcherMutationBuilder<Mutations, Map> & {
  /**
   * Executes a query and returns a Response object.
   */
  response(): Promise<Response>

  /**
   * Executes a query and returns the data out of response.
   */
  fetch(): Promise<{ data: RequestMapReturnType<Map>; errors?: any[] }>

  /**
   * Executes a query and returns the data out of response.
   * Unsafe version returns original root declaration type.
   */
  fetchUnsafe(): Promise<{ data: RequestMapOriginType<Map>; errors?: any[] }>
}

/**
 * Last step of "Subscription" query building is a query execution.
 */
export type FetcherSubscriptionExecutor<
  Subscriptions extends GraphQLDeclarationList,
  Map extends RequestMap
> = FetcherSubscriptionBuilder<Subscriptions, Map> & {
  /**
   * Creates an Observable for a given Subscription.
   */
  observe(): Observable<RequestMapReturnType<Map>>

  /**
   * Creates an Observable for a given Subscription.
   * Returns original type instead of selection.
   */
  observeUnsafe(): Observable<RequestMapOriginType<Map>>
}

/**
 * All "Query" declarations are transformed into callable methods,
 * that user can call to specify what operation is going to be executed.
 */
export type FetcherQueryMethods<
  Queries extends GraphQLDeclarationList,
  CurrentName extends string,
  Map extends RequestMap
> = {
  [P in keyof Queries]: (
    ...args: Parameters<Queries[P]>
  ) => NonArray<NonNullable<ReturnTypeOptional<Queries[P]>>> extends object
    ? {
        /**
         * Choose what to select from a model returned by a GraphQL root declaration.
         */
        select<Selection extends RequestSelection<Queries[P]>>(
          selection: Selection,
        ): FetcherQueryExecutor<
          Queries,
          Map &
            {
              [key in CurrentName]: RequestMapItem<Queries, P, Selection>
            }
        >
      }
    : FetcherQueryExecutor<
        Queries,
        Map &
          {
            [key in CurrentName]: RequestMapItem<Queries, P, never>
          }
      >
}

/**
 * All "Mutation" declarations are transformed into callable methods,
 * that user can call to specify what operation is going to be executed.
 */
export type FetcherMutationMethods<
  Mutations extends GraphQLDeclarationList,
  CurrentName extends string,
  Map extends RequestMap
> = {
  [P in keyof Mutations]: (
    ...args: Parameters<Mutations[P]>
  ) => NonArray<NonNullable<ReturnTypeOptional<Mutations[P]>>> extends object
    ? {
        /**
         * Choose what to select from a model returned by a GraphQL root declaration.
         */
        select<Selection extends RequestSelection<Mutations[P]>>(
          selection: Selection,
        ): FetcherMutationExecutor<
          Mutations,
          Map &
            {
              [key in CurrentName]: RequestMapItem<Mutations, P, Selection>
            }
        >
      }
    : FetcherMutationExecutor<
        Mutations,
        Map &
          {
            [key in CurrentName]: RequestMapItem<Mutations, P, never>
          }
      >
}

/**
 * All "Subscription" declarations are transformed into callable methods,
 * that user can call to specify what operation is going to be executed.
 */
export type FetcherSubscriptionMethods<
  Subscriptions extends GraphQLDeclarationList,
  CurrentName extends string,
  Map extends RequestMap
> = {
  [P in keyof Subscriptions]: (
    ...args: Parameters<Subscriptions[P]>
  ) => NonArray<
    NonNullable<ReturnTypeOptional<Subscriptions[P]>>
  > extends object
    ? {
        /**
         * Choose what to select from a model returned by a GraphQL root declaration.
         */
        select<Selection extends RequestSelection<Subscriptions[P]>>(
          selection: Selection,
        ): FetcherSubscriptionExecutor<
          Subscriptions,
          Map &
            {
              [key in CurrentName]: RequestMapItem<Subscriptions, P, Selection>
            }
        >
      }
    : FetcherSubscriptionExecutor<
        Subscriptions,
        Map &
          {
            [key in CurrentName]: RequestMapItem<Subscriptions, P, never>
          }
      >
}
