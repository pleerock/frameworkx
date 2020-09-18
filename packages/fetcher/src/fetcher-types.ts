import {
  GraphQLDeclarationList,
  NonArray,
  RequestSelection,
  RequestSelectionSchema,
  ReturnTypeOptional,
} from "@microframework/core"
import Observable from "zen-observable"

export type FetcherBuiltMap = {
  [key: string]: RequestSelection<any, any> | ReturnTypeOptional<any>
}

export type FetcherQueryMethods<
  Queries extends GraphQLDeclarationList,
  CurrentName extends string,
  Map extends FetcherBuiltMap
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
              [key in CurrentName]: RequestSelection<
                ReturnTypeOptional<Queries[P]>,
                Selection
              >
            }
        >
      }
    : FetcherQueryExecutor<
        Queries,
        Map &
          {
            [key in CurrentName]: ReturnTypeOptional<Queries[P]>
          }
      >
}
export type FetcherMutationMethods<
  Mutations extends GraphQLDeclarationList,
  CurrentName extends string,
  Map extends FetcherBuiltMap
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
              [key in CurrentName]: RequestSelection<
                ReturnTypeOptional<Mutations[P]>,
                Selection
              >
            }
        >
      }
    : FetcherMutationExecutor<
        Mutations,
        Map &
          {
            [key in CurrentName]: ReturnTypeOptional<Mutations[P]>
          }
      >
}

export type FetcherSubscriptionMethods<
  Subscriptions extends GraphQLDeclarationList,
  CurrentName extends string,
  Map extends FetcherBuiltMap
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
              [key in CurrentName]: RequestSelection<
                ReturnTypeOptional<Subscriptions[P]>,
                Selection
              >
            }
        >
      }
    : FetcherSubscriptionExecutor<
        Subscriptions,
        Map &
          {
            [key in CurrentName]: ReturnTypeOptional<Subscriptions[P]>
          }
      >
}

export type FetcherQueryBuilder<
  Queries extends GraphQLDeclarationList,
  Map extends FetcherBuiltMap
> = {
  add<Name extends string>(name: Name): FetcherQueryMethods<Queries, Name, Map>
}

export type FetcherMutationBuilder<
  Mutations extends GraphQLDeclarationList,
  Map extends FetcherBuiltMap
> = {
  add<Name extends string>(
    name: Name,
  ): FetcherMutationMethods<Mutations, Name, Map>
}

export type FetcherSubscriptionBuilder<
  Subscriptions extends GraphQLDeclarationList,
  Map extends FetcherBuiltMap
> = {
  add<Name extends string>(
    name: Name,
  ): FetcherSubscriptionMethods<Subscriptions, Name, Map>
}

export type FetcherQueryExecutor<
  Queries extends GraphQLDeclarationList,
  Map extends FetcherBuiltMap
> = FetcherQueryBuilder<Queries, Map> & {
  response(): Promise<Response>
  fetch(): Promise<Map>
}

export type FetcherMutationExecutor<
  Mutations extends GraphQLDeclarationList,
  Map extends FetcherBuiltMap
> = FetcherMutationBuilder<Mutations, Map> & {
  response(): Promise<Response>
  fetch(): Promise<Map>
}

export type FetcherSubscriptionExecutor<
  Subscriptions extends GraphQLDeclarationList,
  Map extends FetcherBuiltMap
> = FetcherSubscriptionBuilder<Subscriptions, Map> & {
  observe(): Observable<Map>
}
