import {
  GraphQLDeclarationList,
  NonArray,
  RequestMap,
  RequestMapItem,
  RequestMapOriginType,
  RequestMapReturnType,
  RequestSelectionSchema,
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
  add<Name extends string>(name: Name): FetcherQueryMethods<Queries, Name, Map>
}

/**
 * Initiates a query building for a GraphQL Mutation.
 */
export type FetcherMutationBuilder<
  Mutations extends GraphQLDeclarationList,
  Map extends RequestMap
> = {
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
  response(): Promise<Response>
  fetch(): Promise<{ data: RequestMapReturnType<Map>; errors?: any[] }>
  fetchUnsafe(): Promise<{ data: RequestMapOriginType<Map>; errors?: any[] }>
}

/**
 * Last step of "Mutation" query building is a request execution.
 */
export type FetcherMutationExecutor<
  Mutations extends GraphQLDeclarationList,
  Map extends RequestMap
> = FetcherMutationBuilder<Mutations, Map> & {
  response(): Promise<Response>
  fetch(): Promise<{ data: RequestMapReturnType<Map>; errors?: any[] }>
  fetchUnsafe(): Promise<{ data: RequestMapOriginType<Map>; errors?: any[] }>
}

/**
 * Last step of "Subscription" query building is a query execution.
 */
export type FetcherSubscriptionExecutor<
  Subscriptions extends GraphQLDeclarationList,
  Map extends RequestMap
> = FetcherSubscriptionBuilder<Subscriptions, Map> & {
  observe(): Observable<RequestMapReturnType<Map>>
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
        select<Selection extends RequestSelectionSchema<Queries[P]>>(
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
        select<Selection extends RequestSelectionSchema<Mutations[P]>>(
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
        select<Selection extends RequestSelectionSchema<Subscriptions[P]>>(
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
