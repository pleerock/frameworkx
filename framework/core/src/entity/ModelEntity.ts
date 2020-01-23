import {ApplicationProperties, Model} from "../app";
import {Errors} from "../errors";
import {ApplicationMetadata} from "../metadata";
import {EntityResolveSchema, EntitySchema} from "./types";

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
   * Application's properties.
   */
  readonly appProperties: ApplicationProperties

  /**
   * Application's metadata.
   */
  readonly appMetadata: ApplicationMetadata

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
    appProperties: ApplicationProperties,
    appMetadata: ApplicationMetadata,
    name: string,
  ) {
    this.appProperties = appProperties
    this.appMetadata = appMetadata
    this.name = name
  }

  // static copy(
  //     appProperties: ApplicationProperties,
  //     appMetadata: ApplicationMetadata,
  //     model: ModelEntity<any>
  // ) {
  //   const copy = new ModelEntity(appProperties, appMetadata, model.name)
  //   copy.tableName = model.tableName
  //   copy.entitySchema = model.entitySchema
  //   copy.entityResolveSchema = model.entityResolveSchema
  //   return copy
  // }

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

  /**
   * Get's entity repository.
   */
  get repository() {
    if (!this.appProperties.dataSource)
      throw Errors.noDataSourceInApp()

    return this.appProperties.dataSource.getRepository(this.name)
  }

  /**
   * Get's entity model metadata.
   */
  get modelMetadata() {
    const model = this.appMetadata.models.find(model => model.typeName === this.name)

    if (!model) {
      throw new Error(`Model "${this.name}" was not found`)
    }

    return model
  }

}
