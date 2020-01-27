import {Model} from "../app";
import {EntityResolveSchema, EntitySchema} from "./types";

export function entity<T>(name: string) {
  return new ModelEntity<Model<T>>(name)
}

/**
 * Entity specification.
 */
export class ModelEntity<
  GivenModel extends Model<any, any>
  > {

  /**
   * Model for which we define an entity.
   */
  readonly _model!: GivenModel

  /**
   * Model name.
   */
  readonly name: string

  /**
   * Entity's schema.
   */
  entitySchema?: EntitySchema<GivenModel["blueprint"]>

  /**
   * Entity's resolving strategy.
   */
  entityResolveSchema?: boolean | EntityResolveSchema<GivenModel["blueprint"]>

  /**
   * Table name for this entity.
   */
  tableName?: string

  constructor(
    name: string,
  ) {
    this.name = name
  }

  /**
   * Sets entity table name.
   */
  table(name: string): this {
    this.tableName = name
    return this
  }

  /**
   * Sets entity automatic resolve strategy.
   */
  resolvable(schema: boolean | EntityResolveSchema<GivenModel["blueprint"]>): ModelEntity<GivenModel> {
    this.entityResolveSchema = schema
    return this
  }

  /**
   * Sets entity schema.
   */
  schema(schema: EntitySchema<GivenModel["blueprint"]>): ModelEntity<GivenModel> {
    this.entitySchema = schema
    return this
  }

}
