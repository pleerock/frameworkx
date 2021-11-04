import { ForcedType } from "../application"

/**
 * Helper type to mark non-selected properties as "never".
 */
export type ModelSelectionTruthyKeys<Selection> = {
  [P in keyof Selection]: Selection[P] extends false ? never : P
}[keyof Selection]

/**
 * Helper type to pick non-never properties of the selection.
 */
export type ModelSelectionPick<Model, Selection> = Pick<
  Model,
  {
    [P in keyof Model]: P extends ModelSelectionTruthyKeys<Selection>
      ? P
      : never
  }[keyof Model]
>

/**
 * Schema for a ModelSelection, used to specify what properties of a Model must be selected.
 */
export type ModelSelectionSchema<Model> = NonNullable<Model> extends Array<
  infer U
>
  ? ModelSelectionSchema<U>
  : NonNullable<Model> extends object
  ? {
      [P in keyof Model]?: NonNullable<Model[P]> extends object
        ? ModelSelectionSchema<Model[P]>
        : boolean
    }
  : Model

/**
 * Returns a subset of a model, a new type is based on selection.
 */
export type ModelSelection<
  Model,
  Selection // extends ModelSelectionSchema<Model>
> = Model extends Array<infer U>
  ? ModelSelection<U, Selection>[]
  : // ? ModelSelection<U, ForcedType<Selection, ModelSelectionSchema<U>>>[]
  Model extends object
  ? {
      [P in keyof ModelSelectionPick<Model, Selection>]: ModelSelection<
        Model[P],
        Selection[P]
      >
    }
  : Model
