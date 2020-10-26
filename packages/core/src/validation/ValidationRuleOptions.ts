import { ModelValidationRule, ProjectionValidation } from "./index"
import { ContextList } from "../application"

/**
 * Options to set for ValidationRule.
 */
export type ValidationRuleOptions<T, Context extends ContextList> = {
  /**
   * Projection-based validation for model properties validation.
   */
  projection?: ProjectionValidation<T, Context>

  /**
   * Validation function to be executed for this model.
   */
  validate?: ModelValidationRule<T, Context>
}
