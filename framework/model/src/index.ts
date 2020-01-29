/**
 * Model is a special identifier for your domain models (or any other kind of models)
 * that has a string identifier and reference to a specific type that represents this model.
 */
export class Model<T> {
    readonly type!: T
    readonly name: string
    // readonly instanceof: "Model" = "Model"
    // static readonly instanceof: "Model" = "Model"
    constructor(name: string) {
        this.name = name
    }
}

/**
 * Helper type for utility purposes where Model type doesn't matter.
 */
export type AnyModel = Model<any>

/**
 * Helper function to create a Model in an elegant functional way.
 */
export function model<T = any>(name: string) {
    return new Model<T>(name)
}

/**
 * Checks if given value is a model.
 */
export function isModel(value: any): value is Model<any> {
    return value instanceof Model || value.instanceof === "Model"
}
