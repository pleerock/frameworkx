import { ContextList } from "../application"
import { ValidationRuleOptions } from "./ValidationRuleOptions"

/**
 * Set of validation rules for a particular model.
 */
export type ValidationRule<T, Context extends ContextList> = {

  /**
   * Unique model identifier.
   */
  instanceof: "ValidationRule"

  /**
   * Model that needs to be validated.
   */
  name: string

  /**
   * Validation options.
   */
  options: ValidationRuleOptions<T, Context>

}

/**
 * Represents any validation rule.
 */
export type AnyValidationRule = ValidationRule<any, any>
