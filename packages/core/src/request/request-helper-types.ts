import { ReturnTypeOptional } from "../application"
import { AnyRequestAction } from "./request-action-types"
import { AnyRequestMapItem, Request, RequestMap } from "./request-map-types"
import { ModelSelection } from "../selection"

/**
 * Used to determine a ReturnType of a particular request's selection.
 */
export type RequestReturnType<
  T extends Request<any> | ((...args: any[]) => Request<any>),
  P extends T extends Request<any>
    ? keyof T["map"]
    : keyof ReturnTypeOptional<T>["map"]
> = RequestMapItemReturnType<
  (T extends Request<any> ? T["map"] : ReturnTypeOptional<T>["map"])[P]
>

/**
 * Used to determine a ReturnType of a particular request's selection.
 */
export type RequestOriginType<
  T extends Request<any> | ((...args: any[]) => Request<any>),
  P extends T extends Request<any>
    ? keyof T["map"]
    : keyof ReturnTypeOptional<T>["map"]
> = (T extends Request<any>
  ? T["map"]
  : ReturnTypeOptional<T>["map"])[P]["model"]

/**
 * Returned types of the items from a RequestMap.
 */
export type RequestMapReturnType<
  T extends RequestMap | AnyRequestAction
> = T extends AnyRequestAction
  ? T["_action"]["return"]
  : T extends RequestMap
  ? {
      [P in keyof T]: RequestMapItemReturnType<T[P]>
    }
  : never

/**
 * Original types of the items from a RequestMap.
 */
export type RequestMapOriginType<
  T extends RequestMap | AnyRequestAction
> = T extends AnyRequestAction
  ? T["_action"]["return"]
  : T extends RequestMap
  ? {
      [P in keyof T]: T[P]["_model"]
    }
  : never

/**
 * Type of the RequestMapItem.
 */
export type RequestMapItemReturnType<T extends AnyRequestMapItem> = NonNullable<
  T["_model"]
> extends Array<infer U>
  ? null extends T["_model"]
    ? U extends number
      ? U[] | null
      : U extends string
      ? U[] | null
      : U extends boolean
      ? U[] | null
      : ModelSelection<U, T["_selection"]>[] | null
    : U extends number
    ? U[]
    : U extends string
    ? U[]
    : U extends boolean
    ? U[]
    : ModelSelection<U, T["_selection"]>[]
  : NonNullable<T["_model"]> extends number
  ? T["_model"]
  : NonNullable<T["_model"]> extends string
  ? T["_model"]
  : NonNullable<T["_model"]> extends boolean
  ? T["_model"]
  : null extends T["_model"]
  ? ModelSelection<NonNullable<T["_model"]>, T["_selection"]> | null
  : ModelSelection<T["_model"], T["_selection"]>
