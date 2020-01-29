import { ActionList, ContextList, DeclarationList, InputTypeList, ModelList } from "./ApplicationTypes";

/**
 * Handy way of using ApplicationOptions when its generics don't matter.
 */
export type AnyApplicationOptions = ApplicationOptions<any, any, any, any, any, any, any>

/**
 * Application options passed to the main application entry point.
 */
export type ApplicationOptions<
  Actions extends ActionList,
  Queries extends DeclarationList,
  Mutations extends DeclarationList,
  Subscriptions extends DeclarationList,
  Models extends ModelList,
  Inputs extends InputTypeList,
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

}
