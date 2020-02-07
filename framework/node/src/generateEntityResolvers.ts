import { AnyApplication, ResolverMetadata, TypeMetadata, TypeMetadataUtils, } from "@microframework/core";
import { EntityMetadata, InsertEvent } from "typeorm";
import { ServerProperties } from "./ServerProperties";

/**
 * Transforms entities defined in the app to TypeORM entity format.
 * Should be used to pass app entities to TypeORM connection object.
 */
export function generateEntityResolvers(app: AnyApplication, properties: ServerProperties) {
  const queryResolverSchema: ResolverMetadata[] = [] // ModelResolverSchema<any, any> = {}
  const mutationResolverSchema: ResolverMetadata[] = []
  const subscriptionResolverSchema: ResolverMetadata[] = []
  const queryDeclarations: TypeMetadata[] = []
  const mutationDeclarations: TypeMetadata[] = []
  const subscriptionDeclarations: TypeMetadata[] = []
  const namingStrategy = properties.namingStrategy!! // todo

  // if db connection was established - auto-generate endpoints for models
  if (properties.dataSource && properties.generateModelRootQueries === true) {
    for (const model of app.metadata.models) {
      const modelName = model.typeName!!
      if (!properties.dataSource.hasMetadata(modelName)) continue
      const entityMetadata = properties.dataSource.getMetadata(modelName)

      queryResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "query",
        name: namingStrategy.generatedModelDeclarations.one(modelName),
        resolverFn: async (args: any) => {
          args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
          return await properties
              .dataSource!
              .getRepository(entityMetadata.name)
              .findOne({ where: args.where })
        }
      })
      queryResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "query",
        name: namingStrategy.generatedModelDeclarations.oneNotNull(modelName),
        resolverFn: async (args: any) => {
          args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
          return await properties
              .dataSource!
              .getRepository(entityMetadata.name)
              .findOne({ where: args.where })
        }
      })
      queryResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "query",
        name: namingStrategy.generatedModelDeclarations.many(modelName),
        resolverFn: async (args: any) => {
          args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
          return await properties
              .dataSource!
              .getRepository(entityMetadata.name)
              .find({ where: args.where, order: args.order, take: args.limit, skip: args.offset })
        }
      })

      queryResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "query",
        name: namingStrategy.generatedModelDeclarations.count(modelName),
        resolverFn: async (args: any) => {
          args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
          return await properties
              .dataSource!
              .getRepository(entityMetadata.name)
              .count(args)
        }
      })

      mutationResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "mutation",
        name: namingStrategy.generatedModelDeclarations.save(modelName),
        resolverFn: async (input: any) => {
          return await properties
              .dataSource!
              .getRepository(entityMetadata.name)
              .save(input)
        }
      })

      mutationResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "mutation",
        name: namingStrategy.generatedModelDeclarations.remove(modelName),
        resolverFn: async (args: any) => {
          await properties
              .dataSource!
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

      properties
          .dataSource!
          .subscribers
          .push({
            listenTo: () => {
              return entityMetadata.target;
            },
            afterInsert: (event: InsertEvent<any>) => {
              properties.pubSub!.publish(insertTriggerName, event.entity)
              properties.pubSub!.publish(saveTriggerName, event.entity)
            },
            afterUpdate: event => {
              properties.pubSub!.publish(updateTriggerName, event.entity)
              properties.pubSub!.publish(saveTriggerName, event.entity)
            },
            afterRemove: event => {
              properties.pubSub!.publish(removeTriggerName, event.entity)
            }
          })

      subscriptionResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "subscription",
        name: namingStrategy.generatedModelDeclarations.observeInsert(modelName),
        resolverFn: {
          triggers: [insertTriggerName]
        }
      })
      subscriptionResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "subscription",
        name: namingStrategy.generatedModelDeclarations.observeUpdate(modelName),
        resolverFn: {
          triggers: [updateTriggerName]
        }
      })
      subscriptionResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "subscription",
        name: namingStrategy.generatedModelDeclarations.observeSave(modelName),
        resolverFn: {
          triggers: [saveTriggerName]
        }
      })
      subscriptionResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "subscription",
        name: namingStrategy.generatedModelDeclarations.observeRemove(modelName),
        resolverFn: {
          triggers: [removeTriggerName]
        }
      })

      subscriptionResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "subscription",
        name: namingStrategy.generatedModelDeclarations.observeOne(modelName),
        resolverFn: {
          triggers: [oneTriggerName],
          onSubscribe: (args: any, context: any) => {
            // console.log("subscribed", args)
            context.observeOneEntitySubscription = properties
                .dataSource!
                .manager
                .getRepository(entityMetadata.name)
                .observeOne(args)
                .subscribe(entity => {
                  // console.log("trigger", oneTriggerName)
                  args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
                  properties.pubSub!.publish(oneTriggerName, entity)
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
      subscriptionResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "subscription",
        name: namingStrategy.generatedModelDeclarations.observeMany(modelName),
        resolverFn: {
          triggers: [manyTriggerName],
          onSubscribe: (args: any, context: any) => {
            // console.log("subscribed", args)
            args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
            context.observeOneEntitySubscription = properties
                .dataSource!
                .manager
                .getRepository(entityMetadata.name)
                .observe(args)
                .subscribe(entities => {
                  // console.log("trigger", manyTriggerName, entities)
                  properties.pubSub!.publish(manyTriggerName, entities)
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
      subscriptionResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "subscription",
        name: namingStrategy.generatedModelDeclarations.observeCount(modelName),
        resolverFn: {
          triggers: [countTriggerName],
          onSubscribe: (args: any, context: any) => {
            // console.log("subscribed", args)
            args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
            context.observeOneEntitySubscription = properties
                .dataSource!
                .manager
                .getRepository(entityMetadata.name)
                .observeCount(args)
                .subscribe(entity => {
                  // console.log("trigger", countTriggerName)
                  properties.pubSub!.publish(countTriggerName, entity)
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

      const whereArgsProperties = createWhereArgs(entityMetadata, model, app, properties, 0)
      const saveArgsProperties = createSaveArgs(entityMetadata, model, app, properties, 0)

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

      queryDeclarations.push({
        ...model,
        nullable: true,
        propertyName: namingStrategy.generatedModelDeclarations.one(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.one(modelName),
        args: queryArgs
      })
      queryDeclarations.push({
        ...model,
        nullable: false,
        propertyName: namingStrategy.generatedModelDeclarations.oneNotNull(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.oneNotNull(modelName),
        args: queryArgs
      })
      queryDeclarations.push({
        ...model,
        array: true,
        propertyName: namingStrategy.generatedModelDeclarations.many(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.many(modelName),
        args: queryArgs
      })
      queryDeclarations.push({
        ...TypeMetadataUtils.createType("number"),
        propertyName: namingStrategy.generatedModelDeclarations.count(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.count(modelName),
        args: whereArgs,
      })
      mutationDeclarations.push({
        ...model,
        propertyName: namingStrategy.generatedModelDeclarations.save(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.save(modelName),
        args: saveArgs,
      })
      mutationDeclarations.push({
        ...TypeMetadataUtils.createType("boolean"),
        propertyName: namingStrategy.generatedModelDeclarations.remove(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.remove(modelName),
        args: whereArgs,
      })
      subscriptionDeclarations.push({
        ...model,
        propertyName: namingStrategy.generatedModelDeclarations.observeInsert(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.observeInsert(modelName),
        // args: whereArgs,
      })
      subscriptionDeclarations.push({
        ...model,
        propertyName: namingStrategy.generatedModelDeclarations.observeUpdate(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.observeUpdate(modelName),
        // args: whereArgs,
      })
      subscriptionDeclarations.push({
        ...model,
        propertyName: namingStrategy.generatedModelDeclarations.observeSave(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.observeSave(modelName),
        // args: whereArgs,
      })
      subscriptionDeclarations.push({
        ...model,
        propertyName: namingStrategy.generatedModelDeclarations.observeRemove(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.observeRemove(modelName),
        // args: whereArgs,
      })
      subscriptionDeclarations.push({
        ...model,
        propertyName: namingStrategy.generatedModelDeclarations.observeOne(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.observeOne(modelName),
        args: whereArgs,
      })
      subscriptionDeclarations.push({
        ...model,
        array: true,
        propertyName: namingStrategy.generatedModelDeclarations.observeMany(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.observeMany(modelName),
        args: queryArgs,
      })
      subscriptionDeclarations.push({
        ...TypeMetadataUtils.createType("number"),
        propertyName: namingStrategy.generatedModelDeclarations.observeCount(modelName),
        description: namingStrategy.generatedModelDeclarationDescriptions.observeCount(modelName),
        args: whereArgs,
      })

      // queryDeclarations[namingStrategy.generatedModelDeclarations.oneNotNull(modelName)] = args(entity.model, {
      //   where: nullable(whereArgs),
      //   order: nullable(orderArgs),
      // })
      // queryDeclarations[namingStrategy.generatedModelDeclarations.many(modelName)] = args(array(entity.model), {
      //   where: nullable(whereArgs),
      //   order: nullable(orderArgs),
      //   offset: nullable(Number),
      //   limit: nullable(Number),
      // })
      // queryDeclarations[namingStrategy.generatedModelDeclarations.count(modelName)] = args({ count: Number }, whereArgs)
      //
      // mutationDeclarations[namingStrategy.generatedModelDeclarations.save(modelName)] = args(entity.model, whereArgs)
      // mutationDeclarations[namingStrategy.generatedModelDeclarations.remove(modelName)] = args({ status: String }, whereArgs)
    }
  }

  // console.log(JSON.stringify(queryDeclarations, undefined, 2));

  return {
    queryResolverSchema,
    mutationResolverSchema,
    subscriptionResolverSchema,
    queryDeclarations,
    mutationDeclarations,
    subscriptionDeclarations,
  }
}


const createWhereArgs = (
    entityMetadata: EntityMetadata,
    type: TypeMetadata,
    app: AnyApplication,
    properties: ServerProperties,
    deepness: number
): TypeMetadata[] => {

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
          if (relationWithSuchProperty && deepness < properties.maxGeneratedConditionsDeepness!!) {
            const reference = app.metadata.models.find(type => type.typeName === property.typeName)
            if (!reference)
              throw new Error(`cannot find a type ${property.typeName}`)

            allTypes.push(TypeMetadataUtils.createType("object", {
              typeName: properties.namingStrategy!!.generatedModelInputs.whereRelation(type.typeName!!, property.propertyName!!),
              nullable: true,
              propertyName: property.propertyName,
              properties: createWhereArgs(relationWithSuchProperty.inverseEntityMetadata, reference, app, properties,deepness + 1)
            }))
          }
      }
    }
  // }
  return allTypes
}

const createSaveArgs = (
    entityMetadata: EntityMetadata,
    type: TypeMetadata,
    app: AnyApplication,
    properties: ServerProperties,
    deepness: number
): TypeMetadata[] => {

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
          if (relationWithSuchProperty && deepness < properties.maxGeneratedConditionsDeepness!!) {
            const reference = app.metadata.models.find(type => type.typeName === property.typeName)
            if (!reference)
              throw new Error(`cannot find a type ${property.typeName}`)

            const isArray = relationWithSuchProperty.relationType === "many-to-many" || relationWithSuchProperty.relationType === "one-to-many"

            allTypes.push(TypeMetadataUtils.createType("object", {
              typeName: properties.namingStrategy!!.generatedModelInputs.saveRelation(type.typeName!!, property.propertyName!!),
              nullable: true,
              array: isArray,
              propertyName: property.propertyName,
              properties: createSaveArgs(relationWithSuchProperty.inverseEntityMetadata, reference, app, properties,deepness + 1)
            }))
          }
      }
    }
  // }
  return allTypes
}
