import { ContextList } from "../application"
import { StringValidationConstraints } from "./validation-constraints-string"
import { NumberValidationConstraints } from "./validation-constraints-number"

/**
 * Set of validation rules for a particular model.
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
  projection?: ProjectionValidation<Model, Context>

  /**
   * Validation function to be executed for this model.
   */
  validate?: ModelValidationRule<Model, Context>
}

/**
 * Used to define a function that will validate a given model.
 */
export type ModelValidationRule<T, Context extends ContextList> = (
  object: T,
  context: Context,
) => void | Promise<void>

/**
 * Used to define a function that will validate a given model's property.
 */
export type PropertyValidationRule<
  Model,
  Property extends keyof Model,
  Context extends ContextList
> = (
  value: Model[Property],
  parent: Model,
  context: Context,
) => Model[Property] | Promise<Model[Property] | undefined> | undefined

/**
 * Defines a validation schema for a given model.
 */
export type ProjectionValidation<T, Context extends ContextList> = {
  [P in keyof T]?:
    | PropertyValidationRule<T, P, Context>
    | (T[P] extends null
        ? never
        : T[P] extends undefined
        ? never
        : T[P] extends Array<infer I> | null | undefined
        ? I extends string | null | undefined
          ? StringValidationConstraints
          : I extends number | null | undefined
          ? NumberValidationConstraints
          : never
        : T[P] extends string | null | undefined
        ? StringValidationConstraints
        : T[P] extends number | null | undefined
        ? NumberValidationConstraints
        : never)
}

/**
 * Validator implementation should implement this type for framework to execute a validation.
 */
export type Validator = (options: {
  key: string
  value: any
  options: StringValidationConstraints | NumberValidationConstraints
}) => void | Promise<void>
