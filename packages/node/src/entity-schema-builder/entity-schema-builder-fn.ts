import {
  ApplicationTypeMetadata,
  TypeMetadata,
  TypeMetadataUtils,
} from "@microframework/core"
import { Connection, EntityMetadata, InsertEvent } from "typeorm"
import { ApplicationServerProperties } from "../application-server/application-server-properties-type"

/**
 * Generates resolvers and root declarations for the app entities.
 */
export function generateEntityResolvers(
  appMetadata: ApplicationTypeMetadata,
  properties: ApplicationServerProperties,
  dataSource: Connection,
) {
  const namingStrategy = properties.namingStrategy
  const pubSub = properties.websocket.pubSub
  if (!dataSource)
    throw new Error(`Data source is not setup in the application.`)

  /**
   * Recursively creates WhereArgs for entity.
   */
  const createWhereArgs = (
    entityMetadata: EntityMetadata,
    type: TypeMetadata,
    deepness: number,
  ): TypeMetadata[] => {
    const allTypes: TypeMetadata[] = []
    for (const key in type.properties) {
      const property = type.properties[key]
      if (TypeMetadataUtils.isPrimitive(property) /* or enum? */) {
        const columnWithSuchProperty = entityMetadata.findColumnsWithPropertyPath(
          property.propertyName!,
        )
        if (columnWithSuchProperty) {
          allTypes.push(
            TypeMetadataUtils.create(property.kind, {
              nullable: true,
              propertyName: property.propertyName,
            }),
          )
        }
      } else {
        const relationWithSuchProperty = entityMetadata.findRelationWithPropertyPath(
          property.propertyName!,
        )
        if (
          relationWithSuchProperty &&
          deepness < properties.maxGeneratedConditionsDeepness
        ) {
          const reference = appMetadata.models.find(
            (type) => type.typeName === property.typeName,
          )
          if (!reference)
            throw new Error(`cannot find a type ${property.typeName}`)

          allTypes.push(
            TypeMetadataUtils.create("object", {
              typeName: properties.namingStrategy.generatedModelInputs.whereRelation(
                type.typeName!!,
                property.propertyName!!,
              ),
              nullable: true,
              propertyName: property.propertyName,
              properties: createWhereArgs(
                relationWithSuchProperty.inverseEntityMetadata,
                reference,
                deepness + 1,
              ),
            }),
          )
        }
      }
    }
    // }
    return allTypes
  }

  /**
   * Recursively creates SaveArgs for entity.
   */
  const createSaveArgs = (
    entityMetadata: EntityMetadata,
    type: TypeMetadata,
    deepness: number,
  ): TypeMetadata[] => {
    const allTypes: TypeMetadata[] = []
    for (const key in type.properties) {
      const property = type.properties[key]
      if (TypeMetadataUtils.isPrimitive(property) /* or enum? */) {
        const columnWithSuchProperty = entityMetadata.findColumnsWithPropertyPath(
          property.propertyName!,
        )
        if (columnWithSuchProperty) {
          allTypes.push(
            TypeMetadataUtils.create(property.kind, {
              nullable: true,
              propertyName: property.propertyName,
            }),
          )
        }
      } else {
        const relationWithSuchProperty = entityMetadata.findRelationWithPropertyPath(
          property.propertyName!,
        )
        if (
          relationWithSuchProperty &&
          deepness < properties.maxGeneratedConditionsDeepness
        ) {
          const reference = appMetadata.models.find(
            (type) => type.typeName === property.typeName,
          )
          if (!reference)
            throw new Error(`cannot find a type ${property.typeName}`)

          const isArray =
            relationWithSuchProperty.relationType === "many-to-many" ||
            relationWithSuchProperty.relationType === "one-to-many"

          allTypes.push(
            TypeMetadataUtils.create("object", {
              typeName: properties.namingStrategy.generatedModelInputs.saveRelation(
                type.typeName!!,
                property.propertyName!!,
              ),
              nullable: true,
              array: isArray,
              propertyName: property.propertyName,
              properties: createSaveArgs(
                relationWithSuchProperty.inverseEntityMetadata,
                reference,
                deepness + 1,
              ),
            }),
          )
        }
      }
    }

    // }
    return allTypes
  }

  /**
   * Registers a new resolver in the app.
   */
  const registerResolver = (
    type: "query" | "mutation" | "subscription",
    name: string,
    resolverFn: any,
  ) => {
    // we try to find resolver with the same name to prevent user defined resolver override
    const sameNameResolver = properties.resolvers.find((resolver) => {
      if (resolver.type === "declaration-item-resolver") {
        return resolver.name === name
      } else if (resolver.type === "declaration-resolver") {
        return (resolver.resolverFn as any)[name] !== undefined
      }
      return false
    })

    // register a new resolver
    if (!sameNameResolver) {
      properties.resolvers.push({
        "@type": "Resolver",
        type: "declaration-item-resolver",
        declarationType: type,
        name: name,
        resolverFn: resolverFn,
      })
    }
  }

  /**
   * Registers a new query in the application metadata.
   */
  const registerQuery = (type: TypeMetadata) => {
    const sameNameQuery = appMetadata.queries.find(
      (query) => query.propertyName === type.propertyName,
    )
    if (!sameNameQuery) {
      appMetadata.queries.push(type)
    }
  }

  /**
   * Registers a new mutation in the application metadata.
   */
  const registerMutation = (type: TypeMetadata) => {
    const sameNameMutation = appMetadata.mutations.find(
      (query) => query.propertyName === type.propertyName,
    )
    if (!sameNameMutation) {
      appMetadata.mutations.push(type)
    }
  }

  /**
   * Registers a new subscription in the application metadata.
   */
  const registerSubscription = (type: TypeMetadata) => {
    const sameNameSubscription = appMetadata.subscriptions.find(
      (query) => query.propertyName === type.propertyName,
    )
    if (!sameNameSubscription) {
      appMetadata.subscriptions.push(type)
    }
  }

  // if db connection was established - auto-generate endpoints for models
  for (const model of appMetadata.models) {
    const modelName = model.typeName!!
    if (!dataSource.hasMetadata(modelName)) continue
    const entityMetadata = dataSource.getMetadata(modelName)

    // ------------------------------------------------------------
    // register query resolvers
    // ------------------------------------------------------------

    registerResolver(
      "query",
      namingStrategy.generatedModelDeclarations.one(modelName),
      (args: any) => {
        args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
        return dataSource
          .getRepository(entityMetadata.name)
          .findOne({ where: args.where })
      },
    )

    registerResolver(
      "query",
      namingStrategy.generatedModelDeclarations.oneNotNull(modelName),
      (args: any) => {
        args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
        return dataSource
          .getRepository(entityMetadata.name)
          .findOneOrFail({ where: args.where })
      },
    )

    registerResolver(
      "query",
      namingStrategy.generatedModelDeclarations.many(modelName),
      (args: any) => {
        args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
        return dataSource.getRepository(entityMetadata.name).find({
          where: args.where,
          order: args.order,
          take: args.limit,
          skip: args.offset,
        })
      },
    )

    registerResolver(
      "query",
      namingStrategy.generatedModelDeclarations.count(modelName),
      (args: any) => {
        args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
        return dataSource.getRepository(entityMetadata.name).count(args)
      },
    )

    // ------------------------------------------------------------
    // register mutation resolvers
    // ------------------------------------------------------------

    registerResolver(
      "mutation",
      namingStrategy.generatedModelDeclarations.save(modelName),
      (input: any) => {
        return dataSource.getRepository(entityMetadata.name).save(input)
      },
    )

    registerResolver(
      "mutation",
      namingStrategy.generatedModelDeclarations.remove(modelName),
      (args: any) => {
        return dataSource.getRepository(entityMetadata.name).remove(args)
      },
    )

    // ------------------------------------------------------------
    // register subscription resolvers
    // ------------------------------------------------------------

    if (pubSub) {
      const manyTriggerName = namingStrategy.generatedModelDeclarations.observeManyTriggerName(
        entityMetadata.name,
      )
      const oneTriggerName = namingStrategy.generatedModelDeclarations.observeOneTriggerName(
        entityMetadata.name,
      )
      const countTriggerName = namingStrategy.generatedModelDeclarations.observeCountTriggerName(
        entityMetadata.name,
      )
      const insertTriggerName = namingStrategy.generatedModelDeclarations.observeInsertTriggerName(
        entityMetadata.name,
      )
      const saveTriggerName = namingStrategy.generatedModelDeclarations.observeSaveTriggerName(
        entityMetadata.name,
      )
      const updateTriggerName = namingStrategy.generatedModelDeclarations.observeInsertTriggerName(
        entityMetadata.name,
      )
      const removeTriggerName = namingStrategy.generatedModelDeclarations.observeRemoveTriggerName(
        entityMetadata.name,
      )

      dataSource.subscribers.push({
        listenTo: () => {
          return entityMetadata.target
        },
        afterInsert: (event: InsertEvent<any>) => {
          pubSub!.publish(insertTriggerName, event.entity)
          pubSub!.publish(saveTriggerName, event.entity)
        },
        afterUpdate: (event) => {
          pubSub!.publish(updateTriggerName, event.entity)
          pubSub!.publish(saveTriggerName, event.entity)
        },
        afterRemove: (event) => {
          pubSub!.publish(removeTriggerName, event.entity)
        },
      })

      registerResolver(
        "subscription",
        namingStrategy.generatedModelDeclarations.observeInsert(modelName),
        {
          triggers: [insertTriggerName],
        },
      )

      registerResolver(
        "subscription",
        namingStrategy.generatedModelDeclarations.observeUpdate(modelName),
        {
          triggers: [updateTriggerName],
        },
      )

      registerResolver(
        "subscription",
        namingStrategy.generatedModelDeclarations.observeSave(modelName),
        {
          triggers: [saveTriggerName],
        },
      )
      registerResolver(
        "subscription",
        namingStrategy.generatedModelDeclarations.observeRemove(modelName),
        {
          triggers: [removeTriggerName],
        },
      )

      registerResolver(
        "subscription",
        namingStrategy.generatedModelDeclarations.observeOne(modelName),
        {
          triggers: [oneTriggerName],
          onSubscribe: (args: any, context: any) => {
            // console.log("subscribed", args)
            context.observeOneEntitySubscription = dataSource.manager
              .getRepository(entityMetadata.name)
              .observeOne(args)
              .subscribe((entity) => {
                // console.log("trigger", oneTriggerName)
                args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
                pubSub!.publish(oneTriggerName, entity)
              })
          },
          onUnsubscribe: (args: any, context: any) => {
            if (context.observeOneEntitySubscription) {
              // console.log("unsubscribed", args)
              context.observeOneEntitySubscription.unsubscribe()
            }
          },
        },
      )
      registerResolver(
        "subscription",
        namingStrategy.generatedModelDeclarations.observeMany(modelName),
        {
          triggers: [manyTriggerName],
          onSubscribe: (args: any, context: any) => {
            // console.log("subscribed", args)
            args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
            context.observeOneEntitySubscription = dataSource.manager
              .getRepository(entityMetadata.name)
              .observe(args)
              .subscribe((entities) => {
                // console.log("trigger", manyTriggerName, entities)
                pubSub!.publish(manyTriggerName, entities)
              })
          },
          onUnsubscribe: (args: any, context: any) => {
            if (context.observeOneEntitySubscription) {
              // console.log("unsubscribed", args)
              context.observeOneEntitySubscription.unsubscribe()
            }
          },
        },
      )
      registerResolver(
        "subscription",
        namingStrategy.generatedModelDeclarations.observeCount(modelName),
        {
          triggers: [countTriggerName],
          onSubscribe: (args: any, context: any) => {
            // console.log("subscribed", args)
            args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
            context.observeOneEntitySubscription = dataSource.manager
              .getRepository(entityMetadata.name)
              .observeCount(args)
              .subscribe((entity) => {
                // console.log("trigger", countTriggerName)
                pubSub!.publish(countTriggerName, entity)
              })
          },
          onUnsubscribe: (args: any, context: any) => {
            if (context.observeOneEntitySubscription) {
              // console.log("unsubscribed", args)
              context.observeOneEntitySubscription.unsubscribe()
            }
          },
        },
      )
    }

    // ------------------------------------------------------------
    // prepare root declaration args
    // ------------------------------------------------------------

    const whereArgsProperties = createWhereArgs(entityMetadata, model, 0)
    const saveArgsProperties = createSaveArgs(entityMetadata, model, 0)

    const orderArgsProperties: TypeMetadata[] = []
    for (const key in model.properties) {
      const property = model.properties[key]
      if (TypeMetadataUtils.isPrimitive(property)) {
        // todo: yeah make it more complex like with where
        orderArgsProperties.push(
          TypeMetadataUtils.create("string", {
            propertyName: property.propertyName,
            nullable: true,
          }),
        ) // we need to do enum and specify DESC and ASC
      }
    }

    const whereArgs = TypeMetadataUtils.create("object", {
      typeName: namingStrategy.generatedModelInputs.where(model.typeName!!),
      propertyName: "where",
      nullable: true,
      properties: whereArgsProperties,
    })

    const saveArgs = TypeMetadataUtils.create("object", {
      typeName: namingStrategy.generatedModelInputs.save(model.typeName!!),
      properties: saveArgsProperties,
    })

    const orderByArgs = TypeMetadataUtils.create("object", {
      typeName: namingStrategy.generatedModelInputs.order(model.typeName!!),
      propertyName: "order",
      nullable: true,
      properties: orderArgsProperties,
    })

    const queryArgs = TypeMetadataUtils.create("object", {
      nullable: true,
      properties: [whereArgs, orderByArgs],
    })

    // ------------------------------------------------------------
    // register root queries
    // ------------------------------------------------------------

    registerQuery({
      ...model,
      nullable: true,
      propertyName: namingStrategy.generatedModelDeclarations.one(modelName),
      description: namingStrategy.generatedModelDeclarationDescriptions.one(
        modelName,
      ),
      args: [queryArgs],
    })
    registerQuery({
      ...model,
      nullable: false,
      propertyName: namingStrategy.generatedModelDeclarations.oneNotNull(
        modelName,
      ),
      description: namingStrategy.generatedModelDeclarationDescriptions.oneNotNull(
        modelName,
      ),
      args: [queryArgs],
    })
    registerQuery({
      ...model,
      array: true,
      propertyName: namingStrategy.generatedModelDeclarations.many(modelName),
      description: namingStrategy.generatedModelDeclarationDescriptions.many(
        modelName,
      ),
      args: [queryArgs],
    })
    registerQuery({
      ...TypeMetadataUtils.create("number"),
      propertyName: namingStrategy.generatedModelDeclarations.count(modelName),
      description: namingStrategy.generatedModelDeclarationDescriptions.count(
        modelName,
      ),
      args: [whereArgs],
    })

    // ------------------------------------------------------------
    // register root mutations
    // ------------------------------------------------------------

    registerMutation({
      ...model,
      propertyName: namingStrategy.generatedModelDeclarations.save(modelName),
      description: namingStrategy.generatedModelDeclarationDescriptions.save(
        modelName,
      ),
      args: [saveArgs],
    })
    registerMutation({
      ...TypeMetadataUtils.create("boolean"),
      propertyName: namingStrategy.generatedModelDeclarations.remove(modelName),
      description: namingStrategy.generatedModelDeclarationDescriptions.remove(
        modelName,
      ),
      args: [whereArgs],
    })

    // ------------------------------------------------------------
    // register root subscriptions
    // ------------------------------------------------------------

    if (pubSub) {
      registerSubscription({
        ...model,
        propertyName: namingStrategy.generatedModelDeclarations.observeInsert(
          modelName,
        ),
        description: namingStrategy.generatedModelDeclarationDescriptions.observeInsert(
          modelName,
        ),
        // args: whereArgs,
      })
      registerSubscription({
        ...model,
        propertyName: namingStrategy.generatedModelDeclarations.observeUpdate(
          modelName,
        ),
        description: namingStrategy.generatedModelDeclarationDescriptions.observeUpdate(
          modelName,
        ),
        // args: whereArgs,
      })
      registerSubscription({
        ...model,
        propertyName: namingStrategy.generatedModelDeclarations.observeSave(
          modelName,
        ),
        description: namingStrategy.generatedModelDeclarationDescriptions.observeSave(
          modelName,
        ),
        // args: whereArgs,
      })
      registerSubscription({
        ...model,
        propertyName: namingStrategy.generatedModelDeclarations.observeRemove(
          modelName,
        ),
        description: namingStrategy.generatedModelDeclarationDescriptions.observeRemove(
          modelName,
        ),
        // args: whereArgs,
      })
      registerSubscription({
        ...model,
        propertyName: namingStrategy.generatedModelDeclarations.observeOne(
          modelName,
        ),
        description: namingStrategy.generatedModelDeclarationDescriptions.observeOne(
          modelName,
        ),
        args: [whereArgs],
      })
      registerSubscription({
        ...model,
        array: true,
        propertyName: namingStrategy.generatedModelDeclarations.observeMany(
          modelName,
        ),
        description: namingStrategy.generatedModelDeclarationDescriptions.observeMany(
          modelName,
        ),
        args: [queryArgs],
      })
      registerSubscription({
        ...TypeMetadataUtils.create("number"),
        propertyName: namingStrategy.generatedModelDeclarations.observeCount(
          modelName,
        ),
        description: namingStrategy.generatedModelDeclarationDescriptions.observeCount(
          modelName,
        ),
        args: [whereArgs],
      })
    }
  }
}
