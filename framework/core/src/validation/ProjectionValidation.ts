import { ContextList } from "../application"
import { NumberValidationConstraints, StringValidationConstraints } from "./index"
import { PropertyValidationRule } from "./PropertyValidationRule"

/**
 * Defines a validation schema for a given model.
 */
export type ProjectionValidation<T, Context extends ContextList> = {
  [P in keyof T]?:
    PropertyValidationRule<T, P, Context> |
    (
      T[P] extends null ? never :
      T[P] extends undefined ? never :
      T[P] extends Array<infer I> | null | undefined ? (
        I extends string | null | undefined ? StringValidationConstraints :
        I extends number | null | undefined ? NumberValidationConstraints :
        never
      ) :
      T[P] extends string | null | undefined ? StringValidationConstraints :
      T[P] extends number | null | undefined ? NumberValidationConstraints :
      never
    )
}
