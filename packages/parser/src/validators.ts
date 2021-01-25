import { Errors } from "./errors"
import { ApplicationTypeMetadata } from "@microframework/core"

export function validateApplicationTypeMetadata(
  result: ApplicationTypeMetadata,
) {
  // ----------------------------------------------------------------
  // Check if queries with the same name are defined more than once
  // ----------------------------------------------------------------

  const duplicatedQueries = result.queries
    .map((it) => it.propertyName!)
    .filter((e, i, a) => a.indexOf(e) !== i)
    .filter(onlyUnique)

  if (duplicatedQueries.length) {
    throw Errors.appQueriesDuplicate(duplicatedQueries)
  }

  // ----------------------------------------------------------------
  // Check if mutations with the same name are defined more than once
  // ----------------------------------------------------------------

  const duplicatedMutations = result.mutations
    .map((it) => it.propertyName!)
    .filter((e, i, a) => a.indexOf(e) !== i)
    .filter(onlyUnique)

  if (duplicatedMutations.length) {
    throw Errors.appMutationsDuplicate(duplicatedMutations)
  }

  // --------------------------------------------------------------------
  // Check if subscriptions with the same name are defined more than once
  // --------------------------------------------------------------------

  const duplicatedSubscriptions = result.subscriptions
    .map((it) => it.propertyName!)
    .filter((e, i, a) => a.indexOf(e) !== i)
    .filter(onlyUnique)

  if (duplicatedSubscriptions.length) {
    throw Errors.appSubscriptionsDuplicate(duplicatedSubscriptions)
  }

  const modelTypes = result.models
    .filter((it) => it.typeName)
    .map((it) => it.typeName!)

  // -----------------------------------------------------
  // Check if queries return types are defined in 'model'
  // -----------------------------------------------------

  // const queryReturnTypes = result.queries
  //   .filter((it) => it.typeName)
  //   .map((it) => it.typeName!)
  //   .filter(onlyUnique)
  //
  // const missingQueryReturnTypes = queryReturnTypes.filter(
  //   (it) => modelTypes.indexOf(it) === -1,
  // )
  //
  // if (missingQueryReturnTypes.length) {
  //   throw Errors.appMissingModelType("queries", missingQueryReturnTypes)
  // }

  // ------------------------------------------------------
  // Check if mutations return types are defined in 'model'
  // ------------------------------------------------------

  // const mutationReturnTypes = result.mutations
  //   .filter((it) => it.typeName)
  //   .map((it) => it.typeName!)
  //   .filter(onlyUnique)
  //
  // const missingMutationReturnTypes = mutationReturnTypes.filter(
  //   (it) => modelTypes.indexOf(it) === -1,
  // )
  //
  // if (missingMutationReturnTypes.length) {
  //   throw Errors.appMissingModelType("mutations", missingMutationReturnTypes)
  // }

  // ----------------------------------------------------------
  // Check if subscriptions return types are defined in 'model'
  // ----------------------------------------------------------

  // const subscriptionReturnTypes = result.subscriptions
  //   .filter((it) => it.typeName)
  //   .map((it) => it.typeName!)
  //   .filter(onlyUnique)
  //
  // const missingSubscriptionReturnTypes = subscriptionReturnTypes.filter(
  //   (it) => modelTypes.indexOf(it) === -1,
  // )
  //
  // if (missingSubscriptionReturnTypes.length) {
  //   throw Errors.appMissingModelType(
  //     "subscriptions",
  //     missingSubscriptionReturnTypes,
  //   )
  // }

  // ------------------------------------------------------
  // Check if actions return types are defined in 'model'
  // ------------------------------------------------------

  // const actionReturnTypes = result.actions
  //   .filter((it) => it.return && it.return.typeName)
  //   .map((it) => it.return!.typeName!)
  //   .filter(onlyUnique)
  //
  // const missingActionReturnTypes = actionReturnTypes.filter(
  //   (it) => modelTypes.indexOf(it) === -1,
  // )
  //
  // if (missingActionReturnTypes.length) {
  //   throw Errors.appMissingModelType("actions", missingActionReturnTypes)
  // }

  // ------------------------------------------------------
  // Check if queries input types are defined in 'input'
  // ------------------------------------------------------

  // const inputTypes = result.inputs
  //   .filter((it) => it.typeName)
  //   .map((it) => it.typeName!)
  //
  // const queryInputTypes = result.queries
  //   .filter((it) => it.args.length && it.args[0].typeName)
  //   .map((it) => it.args[0].typeName!)
  //   .filter(onlyUnique)
  //
  // const missingQueryInputTypes = queryInputTypes.filter(
  //   (it) => inputTypes.indexOf(it) === -1,
  // )
  //
  // if (missingQueryInputTypes.length) {
  //   throw Errors.appMissingInputType("queries", missingQueryInputTypes)
  // }

  // ------------------------------------------------------
  // Check if mutations input types are defined in 'input'
  // ------------------------------------------------------
  //
  // const mutationInputTypes = result.mutations
  //   .filter((it) => it.args.length && it.args[0].typeName)
  //   .map((it) => it.args[0].typeName!)
  //   .filter(onlyUnique)
  //
  // const missingMutationInputTypes = mutationInputTypes.filter(
  //   (it) => inputTypes.indexOf(it) === -1,
  // )
  //
  // if (missingMutationInputTypes.length) {
  //   throw Errors.appMissingInputType("mutations", missingMutationInputTypes)
  // }

  // ---------------------------------------------------------
  // Check if subscriptions input types are defined in 'app.inputs'
  // ---------------------------------------------------------

  // const subscriptionInputTypes = result.subscriptions
  //   .filter(
  //     (subscription) =>
  //       subscription.args.length && subscription.args[0].typeName,
  //   )
  //   .map((subscription) => subscription.args[0].typeName!)
  //   .filter(onlyUnique)
  //
  // const missingSubscriptionInputTypes = subscriptionInputTypes.filter(
  //   (subscriptionInputType) => inputTypes.indexOf(subscriptionInputType) === -1,
  // )
  //
  // if (missingSubscriptionInputTypes.length) {
  //   throw Errors.appMissingInputType(
  //     "subscriptions",
  //     missingSubscriptionInputTypes,
  //   )
  // }

  // console.log(JSON.stringify(result, undefined, 2))
}

function onlyUnique<T>(value: T, index: number, self: T[]): boolean {
  return self.indexOf(value) === index
}
