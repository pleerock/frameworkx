import { ValidationError } from "@microframework/core"
import { ValidationErrorCodes } from "./validator-consts"

/**
 * Creates a ValidationError instance.
 */
export function createValidationError(
  key: string | undefined,
  constraintName: keyof typeof ValidationErrorCodes,
) {
  const message = key
    ? `Validation error: ${key} ("${constraintName}")`
    : `Validation error: ("${constraintName}")`
  return new ValidationError(ValidationErrorCodes[constraintName], message)
}
