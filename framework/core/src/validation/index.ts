import { Model } from "@microframework/model";
import { ValidationSchema } from "./type/ValidationSchema";
import { ValidationRule } from "./validator/ValidationRule";

export * from "./constraint/NumberValidationConstraints"
export * from "./constraint/StringValidationConstraints"
export * from "./constraint/ValidationSchemaConstraints"
export * from "./type/ValidationSchema"
export * from "./type/ValidatorOptions"
export * from "./type/Validator"
export * from "./validator/ValidationRule"
export * from "./validator/ValidationRule"

export function validator<T>(name: string | Model<T>, schema: ValidationSchema<T, any>) {
    return new ValidationRule(name, schema)
}
