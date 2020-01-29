import { AnyModel, Model } from "@microframework/model";
import { ModelWithArgs } from "../app";
import { EntityResolveSchema, EntitySchema } from "./types";

export function entity<T>(name: string | Model<T>) {
  return new ModelEntity<ModelWithArgs<T, any>>(name)
}

/**
 * Entity specification.
 */
export class ModelEntity<
  GivenModel extends ModelWithArgs<any, any>
  > {

  /**
   * Model for which we define an entity.
   */
  readonly _model!: GivenModel

  /**
   * Model name.
   */
  readonly name: string | AnyModel

  /**
   * Entity's schema.
   */
  entitySchema?: EntitySchema<GivenModel["type"]>

  /**
   * Entity's resolving strategy.
   */
  entityResolveSchema?: boolean | EntityResolveSchema<GivenModel["type"]>

  /**
   * Table name for this entity.
   */
  tableName?: string

  constructor(
    name: string | AnyModel
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
  resolvable(schema: boolean | EntityResolveSchema<GivenModel["type"]>): ModelEntity<GivenModel> {
    this.entityResolveSchema = schema
    return this
  }

  /**
   * Sets entity schema.
   */
  schema(schema: EntitySchema<GivenModel["type"]>): ModelEntity<GivenModel> {
    this.entitySchema = schema
    return this
  }

}
