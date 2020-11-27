import { StringValidationConstraints } from "./validation-constraints-string"
import { NumberValidationConstraints } from "./validation-constraints-number"

/**
 * Provides a proper validation constraints based on type of a given T.
 * If type isn't supported, returns all possible constraints.
 */
export type ValidationConstraints<T> = T extends string
  ? StringValidationConstraints
  : T extends number
  ? NumberValidationConstraints
  : StringValidationConstraints | NumberValidationConstraints
