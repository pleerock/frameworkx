import { ContextList } from "../application"

/**
 * Used to define a function that will validate a given model's property.
 */
export type PropertyValidationRule<T, P extends keyof T, Context extends ContextList> = (
    value: T[P],
    parent: T,
    context: Context
) => T[P] | Promise<T[P] | undefined> | undefined
