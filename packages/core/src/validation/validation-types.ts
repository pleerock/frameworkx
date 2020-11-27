import { ContextList, FlatMapType } from "../application"
import { ValidationConstraints } from "./validation-constraints"

/**
 * Validation rule for a model with a number of constraints.
 */
export type ValidationRule<Model, Context extends ContextList> = {
  /**
   * Unique model identifier.
   */
  "@type": "ValidationRule"

  /**
   * Model name.
   */
  name: string

  /**
   * Validation options.
   */
  options: ValidationRuleOptions<Model, Context>
}

/**
 * Represents any validation rule.
 */
export type AnyValidationRule = ValidationRule<any, any>

/**
 * Options to set for ValidationRule.
 */
export type ValidationRuleOptions<Model, Context extends ContextList> = {
  /**
   * Projection-based validation for model properties validation.
   */
  projection?: ValidationRuleProjection<Model, Context>

  /**
   * Validation function to be executed for this model.
   */
  validate?: ValidationRuleFn<Model, Context>
}

/**
 * Function that handles a model validation logic.
 */
export type ValidationRuleFn<Model, Context extends ContextList> = (
  model: Model,
  context: Context,
) => void | Promise<void>

/**
 * Function that handles a model's property validation logic.
 */
export type ModelPropertyValidationRule<
  Model,
  Property extends keyof Model,
  Context extends ContextList
> = (
  value: Model[Property],
  parent: Model,
  context: Context,
) => Model[Property] | Promise<Model[Property] | undefined> | undefined

/**
 * If validator validates a model, "model projection" can be used to specify
 * its properties for validation in a type-safe manner.
 */
export type ValidationRuleProjection<Model, Context extends ContextList> = {
  [P in keyof Model]?:
    | ModelPropertyValidationRule<Model, P, Context>
    | ValidationConstraints<FlatMapType<NonNullable<Model[P]>>>
}

/**
 * Validator implementation should implement this type for a framework to execute validation.
 * If validation of a given value is not successful this function must throw an error.
 */
export type ValidationFn<T> = (options: {
  /**
   * Property name / identifier of the validated value.
   * Shown in error message.
   */
  key?: string

  /**
   * Value to be validated.
   */
  value: T

  /**
   * Validation constraints for a given value.
   */
  constraints: ValidationConstraints<T>
}) => void | Promise<void>
