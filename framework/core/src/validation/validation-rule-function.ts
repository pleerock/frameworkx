import { isModel, Model } from "@microframework/model"
import { AnyApplication } from "../application"
import { ValidationRule } from "./ValidationRule"
import { ValidationRuleOptions } from "./ValidationRuleOptions"

/**
 * Creates a new validation rule for a given App's model.
 */
export function validationRule<
    App extends AnyApplication,
    Key extends keyof App["_options"]["models"]
>(
    app: App,
    name: Key,
    options: ValidationRuleOptions<App["_options"]["models"][Key], App["_options"]["context"]>
): ValidationRule<App["_options"]["models"][Key], App["_options"]["context"]>

/**
 * Creates a new validation rule for a given App's input.
 */
export function validationRule<
    App extends AnyApplication,
    Key extends keyof App["_options"]["input"]
>(
    app: App,
    name: Key,
    options: ValidationRuleOptions<App["_options"]["input"][Key], App["_options"]["context"]>
): ValidationRule<App["_options"]["input"][Key], App["_options"]["context"]>

/**
 * Creates a new validation rule for a given model.
 */
export function validationRule<T>(
    name: string | Model<T>,
    options: ValidationRuleOptions<T, any>
): ValidationRule<T, any>

/**
 * Creates a validation rule.
 */
export function validationRule(
    arg1: AnyApplication | string | Model<any>,
    arg2: string | Model<any> | ValidationRuleOptions<any, any>,
    arg3?: ValidationRuleOptions<any, any>
): ValidationRule<any, any> {
    // const app = arg1 instanceof Application ? arg1 : undefined
    const name = typeof arg1 === "string" ? arg1 : isModel(arg1) ? arg1.name : arg2 as string
    const options = (arguments.length === 3 ? arg3 : arg2) as ValidationRuleOptions<any, any>
    return {
        instanceof: "ValidationRule",
        name,
        options
    }
}
