import {ActionList, ContextList, DeclarationList, InputList, ModelList, SelectionList} from "./ApplicationTypes";

// todo: for App add support of classes and interfaces as well

/**
 * Handy way of using ApplicationOptions when its generics don't matter.
 */
export type AnyApplicationOptions = ApplicationOptions<any, any, any, any, any, any, any, any>

/**
 * Handy way to create ApplicationOptions with type suggestions.
 */
export type ApplicationOptionsOf<T extends AnyApplicationOptions> = T

/**
 * Application options passed to the main application entry point.
 */
export type ApplicationOptions<
  Actions extends ActionList,
  Queries extends DeclarationList,
  Mutations extends DeclarationList,
  Subscriptions extends DeclarationList,
  Selections extends SelectionList,
  Models extends ModelList,
  Inputs extends InputList,
  Context extends ContextList,
> = {

  /**
   * List of actions (routes) defined in the app.
   */
  actions?: Actions

  /**
   * List of GraphQL queries defined in the app.
   */
  queries?: Queries

  /**
   * List of GraphQL mutations defined in the app.
   */
  mutations?: Mutations

  /**
   * List of selections to be used.
   */
  selections?: Selections

  /**
   * List of GraphQL subscriptions defined in the app.
   */
  subscriptions?: Subscriptions

  /**
   * List of models in the application.
   */
  models?: Models

  /**
   * List of inputs in the application.
   */
  inputs?: Inputs

  /**
   * List of context variables used in the resolvers.
   */
  context?: Context

  /**
   * List of allowed queries.
   * If provided, backend will only allow those queries.

  allowedQueries?: (
    | ModelSelector<any, any, any, any>
    | ((...args: any[]) => ModelSelector<any, any, any, any>)
    | DeclarationSelector<any, any>
    | ((...args: any[]) => DeclarationSelector<any, any>)
    | string
  )[]*/

}
