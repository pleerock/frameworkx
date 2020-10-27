import { isModel, Model } from "@microframework/model"
import { AnyApplication } from "../application"
import {
  AnyValidationRule,
  ValidationRule,
  ValidationRuleOptions,
} from "./validation-types"

/**
 * Creates a new validation rule for a given App's model.
 */
export function validationRule<
  App extends AnyApplication,
  Key extends keyof App["_options"]["models"],
  Model extends App["_options"]["models"][Key],
  Context extends App["_options"]["context"]
>(
  app: App,
  name: Key,
  options: ValidationRuleOptions<Model, Context>,
): ValidationRule<Model, Context>

/**
 * Creates a new validation rule for a given App's input.
 */
export function validationRule<
  App extends AnyApplication,
  Key extends keyof App["_options"]["inputs"],
  Input extends App["_options"]["inputs"][Key],
  Context extends App["_options"]["context"]
>(
  app: App,
  name: Key,
  options: ValidationRuleOptions<Input, Context>,
): ValidationRule<Input, Context>

/**
 * Creates a new validation rule for a given model.
 */
export function validationRule<T>(
  name: string | Model<T>,
  options: ValidationRuleOptions<T, any>,
): ValidationRule<T, any>

/**
 * Creates a validation rule.
 */
export function validationRule(
  arg1: AnyApplication | string | Model<any>,
  arg2: string | Model<any> | ValidationRuleOptions<any, any>,
  arg3?: ValidationRuleOptions<any, any>,
): AnyValidationRule {
  // const app = arg1 instanceof Application ? arg1 : undefined
  const name =
    typeof arg1 === "string"
      ? arg1
      : isModel(arg1)
      ? arg1.name
      : (arg2 as string)
  const options = (arguments.length === 3
    ? arg3
    : arg2) as ValidationRuleOptions<any, any>
  return {
    "@type": "ValidationRule",
    name,
    options,
  }
}
