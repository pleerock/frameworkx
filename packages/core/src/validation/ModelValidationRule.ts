import { ContextList } from "../application"

/**
 * Used to define a function that will validate a given model.
 */
export type ModelValidationRule<T, Context extends ContextList> = (
  object: T,
  context: Context,
) => void | Promise<void>
