import {
  GraphQLDeclarationItem,
  GraphQLDeclarationList,
  ReturnTypeOptional,
} from "../application"
import { AnyRequestAction } from "./request-action-types"
import { RequestSelection } from "./request-selection-types"

/**
 * A particular query / mutation / subscription request properties.
 */
export type RequestMapItemOptions<
  Declaration extends GraphQLDeclarationItem<any>,
  Selection extends RequestSelection<Declaration>
> = Parameters<Declaration> extends []
  ? ReturnType<Declaration> extends object
    ? {
        select: Selection
      }
    : never
  : Declaration extends (input: infer Input) => infer Return
  ? Return extends object
    ? {
        input: Input
        select: Selection
      }
    : {
        input: Input
      }
  : never

/**
 * Helper type to represent request query / mutation / subscription.
 */
export type RequestMapItem<
  Declarations extends GraphQLDeclarationList,
  Key extends keyof Declarations,
  Selection extends RequestSelection<Declarations[Key]>
> = {
  /**
   * Unique type identifier.
   */
  "@type": "RequestMapItem"

  /**
   * Request type.
   */
  type: "query" | "mutation" | "subscription"

  /**
   * Request map item name.
   */
  name: Key

  /**
   * Additional options. Includes selection properties and input data.
   */
  options: RequestMapItemOptions<Declarations[Key], Selection>

  /**
   * Model to be returned by this query / mutation / subscription.
   * Typing helper. Don't use it in a runtime, its value always undefined.
   */
  _model: ReturnTypeOptional<Declarations[Key]>

  /**
   * Model's selection partition.
   * Typing helper. Don't use it in a runtime, its value always undefined.
   */
  _selection: Selection
}

/**
 * Any RequestMapItem.
 */
export type AnyRequestMapItem = RequestMapItem<any, any, any>

/**
 * List of request items. Each request is a particular query / mutation / subscription.
 */
export type RequestMap = {
  [name: string]: AnyRequestMapItem
}

/**
 * Core request type.
 * Request is a named object with list of queries / mutations / subscriptions inside.
 */
export type Request<Map extends RequestMap | AnyRequestAction> = {
  /**
   * Unique type identifier.
   */
  "@type": "Request"

  /**
   * Request name.
   */
  name: string

  /**
   * Request type.
   */
  type?: "query" | "mutation" | "subscription" | "action"

  /**
   * Request items.
   * Contains different query items, mutation items, subscription items.
   * If it's an action request, map will only contain a single RequestAction.
   */
  map: Map
}
