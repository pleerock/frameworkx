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
 * Returns a subset of a model, new type is based on selection.
 */
export type ModelSelection<Model, Selection> = Model extends Array<infer U>
  ? ModelSelection<U, Selection>[]
  : Model extends object
  ? {
      [P in keyof ModelSelectionPick<Model, Selection>]: Model[P] extends Array<
        infer U
      >
        ? ModelSelection<U, Selection[P]>[]
        : Model[P]
    }
  : never
