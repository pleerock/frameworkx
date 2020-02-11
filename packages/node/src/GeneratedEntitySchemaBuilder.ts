import { ApplicationTypeMetadata, TypeMetadata, TypeMetadataUtils, } from "@microframework/core";
import { EntityMetadata, InsertEvent } from "typeorm";
import { ApplicationServerProperties } from "./ApplicationServerProperties";

export class GeneratedEntitySchemaBuilder {
  
  private appMetadata: ApplicationTypeMetadata
  private properties: ApplicationServerProperties
  
  constructor(appMetadata: ApplicationTypeMetadata, 
              properties: ApplicationServerProperties) {
    this.appMetadata = appMetadata
    this.properties = properties
  }

  /**
   * Registers a new resolver in the app.
   */
  private registerResolver(
    type: "query" | "mutation" | "subscription",
    name: string,
    resolverFn: any
  ) {

    // we try to find resolver with the same name to prevent user defined resolver override
    const sameNameResolver = this.properties.resolvers.find(resolver => {
      if (resolver.type === "declaration-item-resolver") {
        return resolver.name === name
      }
      return false
    })

    // register a new resolver
    if (!sameNameResolver) {
      this.properties.resolvers.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: type,
        name: name,
        resolverFn: resolverFn
      })
    }
  }

  /**
   * Registers a new query in the application metadata.
   */
  private registerQuery(type: TypeMetadata) {
    const sameNameQuery = this.appMetadata.queries.find(query => query.propertyName === type.propertyName)
    if (!sameNameQuery) {
      this.appMetadata.queries.push(type)
    }
  }

  /**
   * Registers a new mutation in the application metadata.
   */
  private registerMutation(type: TypeMetadata) {
    const sameNameMutation = this.appMetadata.mutations.find(query => query.propertyName === type.propertyName)
    if (!sameNameMutation) {
      this.appMetadata.mutations.push(type)
    }
  }

  /**
   * Registers a new subscription in the application metadata.
   */
  private registerSubscription(type: TypeMetadata) {
    const sameNameSubscription = this.appMetadata.subscriptions.find(query => query.propertyName === type.propertyName)
    if (!sameNameSubscription) {
      this.appMetadata.subscriptions.push(type)
    }
  }

  /**
   * Generates types and resolvers and pushes them into provided variables.
   */
  generate() {

    const dataSource = this.properties.dataSource
    const namingStrategy = this.properties.namingStrategy
    const pubSub = this.properties.websocket.pubSub
    if (!dataSource)
      throw new Error(`Data source is not setup in the application.`)

    // if db connection was established - auto-generate endpoints for models
    for (const model of this.appMetadata.models) {
      const modelName = model.typeName!!
      if (!dataSource.hasMetadata(modelName)) continue
      const entityMetadata = dataSource.getMetadata(modelName)

      this.registerResolver(
          "query",
          namingStrategy.generatedModelDeclarations.one(modelName),
          (args: any) => {
            args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
            return dataSource
                .getRepository(entityMetadata.name)
                .findOne({where: args.where})
          },
      )

      this.registerResolver(
          "query",
          namingStrategy.generatedModelDeclarations.oneNotNull(modelName),
          (args: any) => {
            args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
            return dataSource
                .getRepository(entityMetadata.name)
                .findOneOrFail({where: args.where})
          },
      )

      this.registerResolver(
          "query",
          namingStrategy.generatedModelDeclarations.many(modelName),
          (args: any) => {
            args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
            return dataSource
                .getRepository(entityMetadata.name)
                .find({where: args.where, order: args.order, take: args.limit, skip: args.offset})
          },
      )

      this.registerResolver(
          "query",
          namingStrategy.generatedModelDeclarations.count(modelName),
          (args: any) => {
            args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
            return dataSource
                .getRepository(entityMetadata.name)
                .count(args)
          },
      )

      this.registerResolver(
          "mutation",
          namingStrategy.generatedModelDeclarations.save(modelName),
          (input: any) => {
            return dataSource
                .getRepository(entityMetadata.name)
                .save(input)
          }
      )

      this.registerResolver(
          "mutation",
          namingStrategy.generatedModelDeclarations.remove(modelName),
          (args: any) => {
            return dataSource
                .getRepository(entityMetadata.name)
                .remove(args)
          }
      )

      const manyTriggerName = namingStrategy.generatedModelDeclarations.observeManyTriggerName(entityMetadata.name)
      const oneTriggerName = namingStrategy.generatedModelDeclarations.observeOneTriggerName(entityMetadata.name)
      const countTriggerName = namingStrategy.generatedModelDeclarations.observeCountTriggerName(entityMetadata.name)
      const insertTriggerName = namingStrategy.generatedModelDeclarations.observeInsertTriggerName(entityMetadata.name)
      const saveTriggerName = namingStrategy.generatedModelDeclarations.observeSaveTriggerName(entityMetadata.name)
      const updateTriggerName = namingStrategy.generatedModelDeclarations.observeInsertTriggerName(entityMetadata.name)
      const removeTriggerName = namingStrategy.generatedModelDeclarations.observeRemoveTriggerName(entityMetadata.name)

      if (pubSub) {
        dataSource
            .subscribers
            .push({
              listenTo: () => {
                return entityMetadata.target;
              },
              afterInsert: (event: InsertEvent<any>) => {
                pubSub!.publish(insertTriggerName, event.entity)
                pubSub!.publish(saveTriggerName, event.entity)
              },
              afterUpdate: event => {
                pubSub!.publish(updateTriggerName, event.entity)
                pubSub!.publish(saveTriggerName, event.entity)
              },
              afterRemove: event => {
                pubSub!.publish(removeTriggerName, event.entity)
              }
            })

        this.registerResolver(
            "subscription",
            namingStrategy.generatedModelDeclarations.observeInsert(modelName),
            {
              triggers: [insertTriggerName]
            }
        )

        this.registerResolver(
            "subscription",
            namingStrategy.generatedModelDeclarations.observeUpdate(modelName),
            {
              triggers: [updateTriggerName]
            }
        )

        this.registerResolver(
            "subscription",
            namingStrategy.generatedModelDeclarations.observeSave(modelName),
            {
              triggers: [saveTriggerName]
            }
        )
        this.registerResolver(
            "subscription",
            namingStrategy.generatedModelDeclarations.observeRemove(modelName),
            {
              triggers: [removeTriggerName]
            }
        )

        this.registerResolver(
            "subscription",
            namingStrategy.generatedModelDeclarations.observeOne(modelName),
            {
              triggers: [oneTriggerName],
              onSubscribe: (args: any, context: any) => {
                // console.log("subscribed", args)
                context.observeOneEntitySubscription = dataSource
                    .manager
                    .getRepository(entityMetadata.name)
                    .observeOne(args)
                    .subscribe(entity => {
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
              }
            }
        )
        this.registerResolver(
            "subscription",
            namingStrategy.generatedModelDeclarations.observeMany(modelName),
            {
              triggers: [manyTriggerName],
              onSubscribe: (args: any, context: any) => {
                // console.log("subscribed", args)
                args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
                context.observeOneEntitySubscription = dataSource
                    .manager
                    .getRepository(entityMetadata.name)
                    .observe(args)
                    .subscribe(entities => {
                      // console.log("trigger", manyTriggerName, entities)
                      pubSub!.publish(manyTriggerName, entities)
                    })
              },
              onUnsubscribe: (args: any, context: any) => {
                if (context.observeOneEntitySubscription) {
                  // console.log("unsubscribed", args)
                  context.observeOneEntitySubscription.unsubscribe()
                }
              }
            }
        )
        this.registerResolver(
            "subscription",
            namingStrategy.generatedModelDeclarations.observeCount(modelName),
            {
              triggers: [countTriggerName],
              onSubscribe: (args: any, context: any) => {
                // console.log("subscribed", args)
                args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
                context.observeOneEntitySubscription = dataSource
                    .manager
                    .getRepository(entityMetadata.name)
                    .observeCount(args)
                    .subscribe(entity => {
                      // console.log("trigger", countTriggerName)
                      pubSub!.publish(countTriggerName, entity)
                    })
              },
              onUnsubscribe: (args: any, context: any) => {
                if (context.observeOneEntitySubscription) {
                  // console.log("unsubscribed", args)
                  context.observeOneEntitySubscription.unsubscribe()
                }
              }
            }
        )
      }

      const whereArgsProperties = this.createWhereArgs(entityMetadata, model, 0)
      const saveArgsProperties = this.createSaveArgs(entityMetadata, model, 0)

      const orderArgsProperties: TypeMetadata[] = []
      for (const key in model.properties) {
        const property = model.properties[key]
        if (TypeMetadataUtils.isTypePrimitive(property)) { // todo: yeah make it more complex like with where
          orderArgsProperties.push(TypeMetadataUtils.createType("string", {
            propertyName: property.propertyName,
            nullable: true,
          })) // we need to do enum and specify DESC and ASC
        }
      }

      const whereArgs = TypeMetadataUtils.createType("object", {
        typeName: namingStrategy.generatedModelInputs.where(model.typeName!!),
        propertyName: "where",
        nullable: true,
        properties: whereArgsProperties,
      })

      const saveArgs = TypeMetadataUtils.createType("object", {
        typeName: namingStrategy.generatedModelInputs.save(model.typeName!!),
        properties: saveArgsProperties,
      })

      const orderByArgs = TypeMetadataUtils.createType("object", {
        typeName: namingStrategy.generatedModelInputs.order(model.typeName!!),
        propertyName: "order",
        nullable: true,
        properties: orderArgsProperties,
      })

      const queryArgs = TypeMetadataUtils.createType("object", {
        nullable: true,
        properties: [whereArgs, orderByArgs]
      })

      this.registerQuery({
        ...model,
        nullable: true,
        propertyName: namingStrategy.generatedModelDeclarations.one(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.one(modelName),
        args: queryArgs
      })
      this.registerQuery({
        ...model,
        nullable: false,
        propertyName: namingStrategy.generatedModelDeclarations.oneNotNull(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.oneNotNull(modelName),
        args: queryArgs
      })
      this.registerQuery({
        ...model,
        array: true,
        propertyName: namingStrategy.generatedModelDeclarations.many(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.many(modelName),
        args: queryArgs
      })
      this.registerQuery({
        ...TypeMetadataUtils.createType("number"),
        propertyName: namingStrategy.generatedModelDeclarations.count(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.count(modelName),
        args: whereArgs,
      })
      this.registerMutation({
        ...model,
        propertyName: namingStrategy.generatedModelDeclarations.save(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.save(modelName),
        args: saveArgs,
      })
      this.registerMutation({
        ...TypeMetadataUtils.createType("boolean"),
        propertyName: namingStrategy.generatedModelDeclarations.remove(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.remove(modelName),
        args: whereArgs,
      })
      if (pubSub) {
        this.registerSubscription({
          ...model,
          propertyName: namingStrategy.generatedModelDeclarations.observeInsert(modelName),
          description: namingStrategy.generatedModelDeclarationDescriptions.observeInsert(modelName),
          // args: whereArgs,
        })
        this.registerSubscription({
          ...model,
          propertyName: namingStrategy.generatedModelDeclarations.observeUpdate(modelName),
          description: namingStrategy.generatedModelDeclarationDescriptions.observeUpdate(modelName),
          // args: whereArgs,
        })
        this.registerSubscription({
          ...model,
          propertyName: namingStrategy.generatedModelDeclarations.observeSave(modelName),
          description: namingStrategy.generatedModelDeclarationDescriptions.observeSave(modelName),
          // args: whereArgs,
        })
        this.registerSubscription({
          ...model,
          propertyName: namingStrategy.generatedModelDeclarations.observeRemove(modelName),
          description: namingStrategy.generatedModelDeclarationDescriptions.observeRemove(modelName),
          // args: whereArgs,
        })
        this.registerSubscription({
          ...model,
          propertyName: namingStrategy.generatedModelDeclarations.observeOne(modelName),
          description: namingStrategy.generatedModelDeclarationDescriptions.observeOne(modelName),
          args: whereArgs,
        })
        this.registerSubscription({
          ...model,
          array: true,
          propertyName: namingStrategy.generatedModelDeclarations.observeMany(modelName),
          description: namingStrategy.generatedModelDeclarationDescriptions.observeMany(modelName),
          args: queryArgs,
        })
        this.registerSubscription({
          ...TypeMetadataUtils.createType("number"),
          propertyName: namingStrategy.generatedModelDeclarations.observeCount(modelName),
          description: namingStrategy.generatedModelDeclarationDescriptions.observeCount(modelName),
          args: whereArgs,
        })
    }
    }
  }

  private createWhereArgs(
      entityMetadata: EntityMetadata,
      type: TypeMetadata,
      deepness: number
  ): TypeMetadata[] {

    const allTypes: TypeMetadata[] = []
    for (const key in type.properties) {
      const property = type.properties[key]
      if (TypeMetadataUtils.isTypePrimitive(property) /* or enum? */) {
        const columnWithSuchProperty = entityMetadata.findColumnsWithPropertyPath(property.propertyName!)
        if (columnWithSuchProperty) {
          allTypes.push(TypeMetadataUtils.createType(property.kind, {
            nullable: true,
            propertyName: property.propertyName,
          }))
        }
      } else {
        const relationWithSuchProperty = entityMetadata.findRelationWithPropertyPath(property.propertyName!)
        if (relationWithSuchProperty && deepness < this.properties.maxGeneratedConditionsDeepness) {
          const reference = this.appMetadata.models.find(type => type.typeName === property.typeName)
          if (!reference)
            throw new Error(`cannot find a type ${property.typeName}`)

          allTypes.push(TypeMetadataUtils.createType("object", {
            typeName: this.properties.namingStrategy.generatedModelInputs.whereRelation(type.typeName!!, property.propertyName!!),
            nullable: true,
            propertyName: property.propertyName,
            properties: this.createWhereArgs(relationWithSuchProperty.inverseEntityMetadata, reference, deepness + 1)
          }))
        }
      }
    }
    // }
    return allTypes
  }

  private createSaveArgs(
      entityMetadata: EntityMetadata,
      type: TypeMetadata,
      deepness: number
  ): TypeMetadata[] {

    const allTypes: TypeMetadata[] = []
    for (const key in type.properties) {
      const property = type.properties[key]
      if (TypeMetadataUtils.isTypePrimitive(property) /* or enum? */) {
        const columnWithSuchProperty = entityMetadata.findColumnsWithPropertyPath(property.propertyName!)
        if (columnWithSuchProperty) {
          allTypes.push(TypeMetadataUtils.createType(property.kind, {
            nullable: true,
            propertyName: property.propertyName,
          }))
        }
      } else {
        const relationWithSuchProperty = entityMetadata.findRelationWithPropertyPath(property.propertyName!)
        if (relationWithSuchProperty && deepness < this.properties.maxGeneratedConditionsDeepness) {
          const reference = this.appMetadata.models.find(type => type.typeName === property.typeName)
          if (!reference)
            throw new Error(`cannot find a type ${property.typeName}`)

          const isArray = relationWithSuchProperty.relationType === "many-to-many" || relationWithSuchProperty.relationType === "one-to-many"

          allTypes.push(TypeMetadataUtils.createType("object", {
            typeName: this.properties.namingStrategy.generatedModelInputs.saveRelation(type.typeName!!, property.propertyName!!),
            nullable: true,
            array: isArray,
            propertyName: property.propertyName,
            properties: this.createSaveArgs(relationWithSuchProperty.inverseEntityMetadata, reference, deepness + 1)
          }))
        }
      }
    }

    // }
    return allTypes
  }

}
