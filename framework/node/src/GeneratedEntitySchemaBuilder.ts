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

      this.properties.resolvers.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "query",
        name: namingStrategy.generatedModelDeclarations.one(modelName),
        resolverFn: async (args: any) => {
          args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
          return await dataSource
              .getRepository(entityMetadata.name)
              .findOne({ where: args.where })
        }
      })
      this.properties.resolvers.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "query",
        name: namingStrategy.generatedModelDeclarations.oneNotNull(modelName),
        resolverFn: async (args: any) => {
          args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
          return await dataSource
              .getRepository(entityMetadata.name)
              .findOne({ where: args.where })
        }
      })
      this.properties.resolvers.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "query",
        name: namingStrategy.generatedModelDeclarations.many(modelName),
        resolverFn: async (args: any) => {
          args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
          return await dataSource
              .getRepository(entityMetadata.name)
              .find({ where: args.where, order: args.order, take: args.limit, skip: args.offset })
        }
      })

      this.properties.resolvers.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "query",
        name: namingStrategy.generatedModelDeclarations.count(modelName),
        resolverFn: async (args: any) => {
          args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
          return await dataSource
              .getRepository(entityMetadata.name)
              .count(args)
        }
      })

      this.properties.resolvers.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "mutation",
        name: namingStrategy.generatedModelDeclarations.save(modelName),
        resolverFn: async (input: any) => {
          return await dataSource
              .getRepository(entityMetadata.name)
              .save(input)
        }
      })

      this.properties.resolvers.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "mutation",
        name: namingStrategy.generatedModelDeclarations.remove(modelName),
        resolverFn: async (args: any) => {
          await dataSource
              .getRepository(entityMetadata.name)
              .remove(args)
          return true
        }
      })

      const manyTriggerName = namingStrategy.generatedModelDeclarations.observeManyTriggerName(entityMetadata.name)
      const oneTriggerName = namingStrategy.generatedModelDeclarations.observeOneTriggerName(entityMetadata.name)
      const countTriggerName = namingStrategy.generatedModelDeclarations.observeCountTriggerName(entityMetadata.name)
      const insertTriggerName = namingStrategy.generatedModelDeclarations.observeInsertTriggerName(entityMetadata.name)
      const saveTriggerName = namingStrategy.generatedModelDeclarations.observeSaveTriggerName(entityMetadata.name)
      const updateTriggerName = namingStrategy.generatedModelDeclarations.observeInsertTriggerName(entityMetadata.name)
      const removeTriggerName = namingStrategy.generatedModelDeclarations.observeRemoveTriggerName(entityMetadata.name)

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

      this.properties.resolvers.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "subscription",
        name: namingStrategy.generatedModelDeclarations.observeInsert(modelName),
        resolverFn: {
          triggers: [insertTriggerName]
        }
      })
      this.properties.resolvers.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "subscription",
        name: namingStrategy.generatedModelDeclarations.observeUpdate(modelName),
        resolverFn: {
          triggers: [updateTriggerName]
        }
      })
      this.properties.resolvers.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "subscription",
        name: namingStrategy.generatedModelDeclarations.observeSave(modelName),
        resolverFn: {
          triggers: [saveTriggerName]
        }
      })
      this.properties.resolvers.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "subscription",
        name: namingStrategy.generatedModelDeclarations.observeRemove(modelName),
        resolverFn: {
          triggers: [removeTriggerName]
        }
      })

      this.properties.resolvers.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "subscription",
        name: namingStrategy.generatedModelDeclarations.observeOne(modelName),
        resolverFn: {
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
      })
      this.properties.resolvers.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "subscription",
        name: namingStrategy.generatedModelDeclarations.observeMany(modelName),
        resolverFn: {
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
      })
      this.properties.resolvers.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "subscription",
        name: namingStrategy.generatedModelDeclarations.observeCount(modelName),
        resolverFn: {
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
      })

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

      this.appMetadata.queries.push({
        ...model,
        nullable: true,
        propertyName: namingStrategy.generatedModelDeclarations.one(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.one(modelName),
        args: queryArgs
      })
      this.appMetadata.queries.push({
        ...model,
        nullable: false,
        propertyName: namingStrategy.generatedModelDeclarations.oneNotNull(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.oneNotNull(modelName),
        args: queryArgs
      })
      this.appMetadata.queries.push({
        ...model,
        array: true,
        propertyName: namingStrategy.generatedModelDeclarations.many(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.many(modelName),
        args: queryArgs
      })
      this.appMetadata.queries.push({
        ...TypeMetadataUtils.createType("number"),
        propertyName: namingStrategy.generatedModelDeclarations.count(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.count(modelName),
        args: whereArgs,
      })
      this.appMetadata.mutations.push({
        ...model,
        propertyName: namingStrategy.generatedModelDeclarations.save(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.save(modelName),
        args: saveArgs,
      })
      this.appMetadata.mutations.push({
        ...TypeMetadataUtils.createType("boolean"),
        propertyName: namingStrategy.generatedModelDeclarations.remove(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.remove(modelName),
        args: whereArgs,
      })
      this.appMetadata.subscriptions.push({
        ...model,
        propertyName: namingStrategy.generatedModelDeclarations.observeInsert(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.observeInsert(modelName),
        // args: whereArgs,
      })
      this.appMetadata.subscriptions.push({
        ...model,
        propertyName: namingStrategy.generatedModelDeclarations.observeUpdate(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.observeUpdate(modelName),
        // args: whereArgs,
      })
      this.appMetadata.subscriptions.push({
        ...model,
        propertyName: namingStrategy.generatedModelDeclarations.observeSave(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.observeSave(modelName),
        // args: whereArgs,
      })
      this.appMetadata.subscriptions.push({
        ...model,
        propertyName: namingStrategy.generatedModelDeclarations.observeRemove(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.observeRemove(modelName),
        // args: whereArgs,
      })
      this.appMetadata.subscriptions.push({
        ...model,
        propertyName: namingStrategy.generatedModelDeclarations.observeOne(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.observeOne(modelName),
        args: whereArgs,
      })
      this.appMetadata.subscriptions.push({
        ...model,
        array: true,
        propertyName: namingStrategy.generatedModelDeclarations.observeMany(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.observeMany(modelName),
        args: queryArgs,
      })
      this.appMetadata.subscriptions.push({
        ...TypeMetadataUtils.createType("number"),
        propertyName: namingStrategy.generatedModelDeclarations.observeCount(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.observeCount(modelName),
        args: whereArgs,
      })

      // this.appMetadata.queries[namingStrategy.generatedModelDeclarations.oneNotNull(modelName)] = args(entity.model, {
      //   where: nullable(whereArgs),
      //   order: nullable(orderArgs),
      // })
      // this.appMetadata.queries[namingStrategy.generatedModelDeclarations.many(modelName)] = args(array(entity.model), {
      //   where: nullable(whereArgs),
      //   order: nullable(orderArgs),
      //   offset: nullable(Number),
      //   limit: nullable(Number),
      // })
      // this.appMetadata.queries[namingStrategy.generatedModelDeclarations.count(modelName)] = args({ count: Number }, whereArgs)
      //
      // this.appMetadata.mutations[namingStrategy.generatedModelDeclarations.save(modelName)] = args(entity.model, whereArgs)
      // this.appMetadata.mutations[namingStrategy.generatedModelDeclarations.remove(modelName)] = args({ status: String }, whereArgs)
    }

    // console.log(JSON.stringify(appMetadata.queries, undefined, 2));

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
