import { GraphQLDeclarationItem } from "../application"

/**
 * Helper type for RequestSelection.
 */
export type RequestSelectionMapItem<T> = NonNullable<T> extends Array<infer U>
  ? NonNullable<U> extends string
    ? boolean
    : NonNullable<U> extends number
    ? boolean
    : NonNullable<U> extends boolean
    ? boolean
    : RequestSelectionMap<U>
  : NonNullable<T> extends Object
  ? RequestSelectionMap<T>
  : boolean

/**
 * Helper type for RequestSelectionSchema type.
 */
export type RequestSelectionMap<T> = {
  [P in keyof T]?: NonNullable<T[P]> extends string
    ? boolean
    : NonNullable<T[P]> extends number
    ? boolean
    : NonNullable<T[P]> extends boolean
    ? boolean
    : NonNullable<T[P]> extends Array<infer U>
    ? NonNullable<U> extends string
      ? boolean
      : NonNullable<U> extends number
      ? boolean
      : NonNullable<U> extends boolean
      ? boolean
      : RequestSelectionMapItem<U>
    : NonNullable<T[P]> extends Object
    ? RequestSelectionMapItem<T[P]>
    : boolean
}

/**
 * Request selection schema.
 * Using this schema user lists properties he wants to select from a model.
 * Example: { id: true, name: string, category: { id: true, name: false }}
 */
export type RequestSelection<
  Declaration extends GraphQLDeclarationItem<any>
> = NonNullable<ReturnType<Declaration>> extends Array<infer U>
  ? RequestSelectionMap<U>
  : NonNullable<ReturnType<Declaration>> extends Object
  ? RequestSelectionMap<ReturnType<Declaration>>
  : never
