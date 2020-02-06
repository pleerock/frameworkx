import {NumberValidationConstraints, StringValidationConstraints} from "..";
import {ContextList} from "../../application";

/**
 * Validation schema for a Blueprint of the model or input.
 */
export type ValidationSchema<Blueprint, Context extends ContextList> = {
  [P in keyof Blueprint]?:
    (
        (value: Blueprint[P], parent: Blueprint, context: Context) => Blueprint[P] | Promise<Blueprint[P] | undefined> | undefined
        // PropertyValidatorFn<T, T[P], Context>
    )
        |
    (
      Blueprint[P] extends null ? never :
      Blueprint[P] extends undefined ? never :
      Blueprint[P] extends Array<infer I> | null | undefined ? (
        I extends string | null | undefined ? StringValidationConstraints :
        I extends number ? NumberValidationConstraints :
        // I extends FloatConstructor ? NumberValidationConstraints :
        never
      ) :
      Blueprint[P] extends string | null | undefined ? StringValidationConstraints :
      Blueprint[P] extends number | null | undefined ? NumberValidationConstraints :
      // Blueprint[P] extends Float ? NumberValidationConstraints :
      never
    )
}
