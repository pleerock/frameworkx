import {Repository} from "typeorm";
import {ApplicationProperties, ContextList, Model} from "../app";
import {ModelEntity} from "../entity";
import {Errors} from "../errors";
import {ApplicationMetadata} from "../metadata";
import {CustomRepositoryFactory} from "../repository";
import {ModelSelector} from "../selection";
import {
  BlueprintCondition,
  DeclarationSelection,
  DeclarationSelectorResult,
  executeQuery,
  ModelDataLoaderResolverSchema,
  ModelResolverSchema,
  Resolver,
} from "../types";
import {ModelValidator, ValidationSchema} from "../validation";

/**
 * Models manager - allows to define resolver for the models and select data from the client.
 */
export class ModelManager<
  M extends Model<any, any>,
  Context extends ContextList
> {

  /**
   * Model instance.
   */
  readonly _model!: M

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

  constructor(
    appProperties: ApplicationProperties,
    appMetadata: ApplicationMetadata,
    name: string,
  ) {
    this.appProperties = appProperties
    this.appMetadata = appMetadata
    this.name = name
  }

  /**
   * Registers a new model validator.
   */
  validator(schema: ValidationSchema<M["blueprint"], Context>): ModelValidator<M, Context> {
    return new ModelValidator(this.name, schema)
  }

  /**
   * Returns an entity builder for a given defined model.
   */
  entity(): ModelEntity<M> {
    return new ModelEntity(this.name)
  }

  /**
   * Returns entity repository for a given defined model together with defined custom repository functions.
   */
  repository<CustomRepositoryDefinition>(customRepository?: CustomRepositoryFactory<Repository<M["blueprint"]>, CustomRepositoryDefinition>): Repository<M["blueprint"]> & CustomRepositoryDefinition {
    return new Proxy({} as any, {
      get: (obj, prop) => {
        if (!obj.repository) {
          if (!this.appProperties.dataSource)
            throw Errors.noDataSourceInApp()

          const ormRepository = this.appProperties.dataSource.getRepository<any>(this.name as string)
          if (customRepository) {
            obj.repository = Object.assign(
              new (ormRepository.constructor as any)(),
              ormRepository,
              customRepository(ormRepository)
            )
          } else {
            obj.repository = ormRepository
          }
        }

        return obj.repository[prop]
      }
    })
  }

  /**
   * To improve resolvers performance when different property resolvers rely on the same data,
   * but this data has computation costs, we can use this method to execute computations
   * before resolving each property. Then we'll be able to access our properties in the resolver.
   *
   * todo
   */
  beforeResolve(callback: (context: Context) => any) {

  }

  /**
   * Defines a resolver for the model.
   */
  resolve(
    schema: ModelResolverSchema<M, Context>,
    dataLoaderSchema?: ModelDataLoaderResolverSchema<M, Context>,
  ): Resolver {
    return new Resolver({
      type: "model",
      name: this.name,
      schema: schema,
      dataLoaderSchema: dataLoaderSchema,
    })
  }

  /**
   * Returns a model fetcher to select one model.
   */
  one<Selection extends DeclarationSelection<M, true>>(
    selection: Selection
  ): ModelSelector<M, Context, Selection, DeclarationSelectorResult<M, Selection>> {
    return new ModelSelector(
      this.appProperties,
      this.appProperties.namingStrategy.generatedModelDeclarations.one(this.name),
      selection,
    )
  }

  /**
   * Returns a model fetcher to select many models.
   */
  many<Selection extends DeclarationSelection<M, true>>(
    selection: Selection
  ): ModelSelector<M, Context, Selection, DeclarationSelectorResult<M, Selection>[]> {
    return new ModelSelector(
      this.appProperties,
      this.appProperties.namingStrategy.generatedModelDeclarations.many(this.name),
      selection,
    )
  }

  /**
   * Returns a model fetcher to select a models count.
   */
  count<Condition extends BlueprintCondition<M["blueprint"]>>(
    condition: Condition
  ) {
    const that = this
    return {
      fetch(): Promise<number> {
        return executeQuery(
          that.appProperties.client,
          "query",
          that.appProperties.namingStrategy.generatedModelDeclarations.count(that.name),
          {
            select: {
              count: true
            },
            args: {
              ...condition
            }
          } as any,
          0  as any
        )
          .then(result => result.count)
      }
    }
  }

  /**
   * Returns a model fetcher to save a model.
   */
  save<Selection extends DeclarationSelection<M, false>>(
    model: Partial<M["blueprint"]>,
    selection: Selection
  ) {
    const that = this
    return {
      fetch(): Promise<DeclarationSelectorResult<M, Selection>> {
        return executeQuery(
          that.appProperties.client,
          "mutation",
          that.appProperties.namingStrategy.generatedModelDeclarations.save(that.name),
          {
            select: selection.select,
            args: {
              ...model
            }
          } as any,
          0 as any
        )
      }
    }
  }

  /**
   * Returns a model fetcher to remove a model.
   */
  remove<Condition extends BlueprintCondition<M["blueprint"]>>(
    condition: Condition
  ) {
    const that = this
    return {
      fetch(): Promise<void> {
        return executeQuery(
          that.appProperties.client,
          "mutation",
          that.appProperties.namingStrategy.generatedModelDeclarations.remove(that.name),
          {
            select: {
              status: true
            },
            args: {
              ...condition
            }
          } as any,
          0  as any
        )
          .then(() => {})
      }
    }
  }

}
