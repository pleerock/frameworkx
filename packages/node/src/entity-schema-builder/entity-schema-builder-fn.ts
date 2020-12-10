import {
  ApplicationTypeMetadata,
  TypeMetadata,
  TypeMetadataUtils,
} from "@microframework/core"
import { Connection, InsertEvent } from "typeorm"
import { ApplicationServerProperties } from "../application-server"
import {
  DeclarationHelper,
  EntitySchemaArgsHelper,
  ResolverHelper,
} from "./entity-schema-builder-utils"

/**
 * Generates root declarations type metadatas and resolvers for them.
 * Generated entries are used for
 */
export function generateEntityResolvers(
  appMetadata: ApplicationTypeMetadata,
  properties: ApplicationServerProperties,
  dataSource: Connection,
) {
  const namingStrategy = properties.namingStrategy
  const pubSub = properties.websocket.pubSub
  if (!dataSource)
    throw new Error(`Data source is not setup in the application options.`)

  // go through all models and generate entity metadata for them
  for (const model of appMetadata.models) {
    if (!model.typeName) continue
    if (!dataSource.hasMetadata(model.typeName)) continue
    const entityMetadata = dataSource.getMetadata(model.typeName)

    // ------------------------------------------------------------
    // register query resolvers
    // ------------------------------------------------------------

    ResolverHelper.pushResolver(
      properties.resolvers,
      "query",
      namingStrategy.generatedEntityDeclarationNames.one(model.typeName),
      (args: any) => {
        args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
        return dataSource
          .getRepository(entityMetadata.name)
          .findOne({ where: args.where })
      },
    )

    ResolverHelper.pushResolver(
      properties.resolvers,
      "query",
      namingStrategy.generatedEntityDeclarationNames.oneNotNull(model.typeName),
      (args: any) => {
        args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
        return dataSource
          .getRepository(entityMetadata.name)
          .findOneOrFail({ where: args.where })
      },
    )

    ResolverHelper.pushResolver(
      properties.resolvers,
      "query",
      namingStrategy.generatedEntityDeclarationNames.many(model.typeName),
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

    ResolverHelper.pushResolver(
      properties.resolvers,
      "query",
      namingStrategy.generatedEntityDeclarationNames.count(model.typeName),
      (args: any) => {
        args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
        return dataSource.getRepository(entityMetadata.name).count(args)
      },
    )

    // ------------------------------------------------------------
    // register mutation resolvers
    // ------------------------------------------------------------

    ResolverHelper.pushResolver(
      properties.resolvers,
      "mutation",
      namingStrategy.generatedEntityDeclarationNames.save(model.typeName),
      (input: any) => {
        return dataSource.getRepository(entityMetadata.name).save(input)
      },
    )

    ResolverHelper.pushResolver(
      properties.resolvers,
      "mutation",
      namingStrategy.generatedEntityDeclarationNames.remove(model.typeName),
      (args: any) => {
        return dataSource.getRepository(entityMetadata.name).remove(args)
      },
    )

    // ------------------------------------------------------------
    // register subscription resolvers
    // ------------------------------------------------------------

    if (pubSub) {
      const manyTriggerName = namingStrategy.generatedEntityDeclarationNames.observeManyTriggerName(
        entityMetadata.name,
      )
      const oneTriggerName = namingStrategy.generatedEntityDeclarationNames.observeOneTriggerName(
        entityMetadata.name,
      )
      const countTriggerName = namingStrategy.generatedEntityDeclarationNames.observeCountTriggerName(
        entityMetadata.name,
      )
      const insertTriggerName = namingStrategy.generatedEntityDeclarationNames.observeInsertTriggerName(
        entityMetadata.name,
      )
      const saveTriggerName = namingStrategy.generatedEntityDeclarationNames.observeSaveTriggerName(
        entityMetadata.name,
      )
      const updateTriggerName = namingStrategy.generatedEntityDeclarationNames.observeInsertTriggerName(
        entityMetadata.name,
      )
      const removeTriggerName = namingStrategy.generatedEntityDeclarationNames.observeRemoveTriggerName(
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

      ResolverHelper.pushResolver(
        properties.resolvers,
        "subscription",
        namingStrategy.generatedEntityDeclarationNames.observeInsert(
          model.typeName,
        ),
        {
          triggers: [insertTriggerName],
        },
      )

      ResolverHelper.pushResolver(
        properties.resolvers,
        "subscription",
        namingStrategy.generatedEntityDeclarationNames.observeUpdate(
          model.typeName,
        ),
        {
          triggers: [updateTriggerName],
        },
      )

      ResolverHelper.pushResolver(
        properties.resolvers,
        "subscription",
        namingStrategy.generatedEntityDeclarationNames.observeSave(
          model.typeName,
        ),
        {
          triggers: [saveTriggerName],
        },
      )
      ResolverHelper.pushResolver(
        properties.resolvers,
        "subscription",
        namingStrategy.generatedEntityDeclarationNames.observeRemove(
          model.typeName,
        ),
        {
          triggers: [removeTriggerName],
        },
      )

      ResolverHelper.pushResolver(
        properties.resolvers,
        "subscription",
        namingStrategy.generatedEntityDeclarationNames.observeOne(
          model.typeName,
        ),
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
      ResolverHelper.pushResolver(
        properties.resolvers,
        "subscription",
        namingStrategy.generatedEntityDeclarationNames.observeMany(
          model.typeName,
        ),
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
      ResolverHelper.pushResolver(
        properties.resolvers,
        "subscription",
        namingStrategy.generatedEntityDeclarationNames.observeCount(
          model.typeName,
        ),
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

    const whereArgsProperties = EntitySchemaArgsHelper.createWhereArgs(
      appMetadata,
      properties,
      entityMetadata,
      model,
      0,
    )
    const saveArgsProperties = EntitySchemaArgsHelper.createSaveArgs(
      appMetadata,
      properties,
      entityMetadata,
      model,
      0,
    )

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
      typeName: namingStrategy.generatedEntityDeclarationArgsInputs.where(
        model.typeName!!,
      ),
      propertyName: "where",
      nullable: true,
      properties: whereArgsProperties,
    })

    const saveArgs = TypeMetadataUtils.create("object", {
      typeName: namingStrategy.generatedEntityDeclarationArgsInputs.save(
        model.typeName!!,
      ),
      properties: saveArgsProperties,
    })

    const orderByArgs = TypeMetadataUtils.create("object", {
      typeName: namingStrategy.generatedEntityDeclarationArgsInputs.order(
        model.typeName!!,
      ),
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

    DeclarationHelper.pushQuery(appMetadata.queries, {
      ...model,
      nullable: true,
      propertyName: namingStrategy.generatedEntityDeclarationNames.one(
        model.typeName,
      ),
      description: namingStrategy.generatedEntityDeclarationDescriptions.one(
        model.typeName,
      ),
      args: [queryArgs],
    })
    DeclarationHelper.pushQuery(appMetadata.queries, {
      ...model,
      nullable: false,
      propertyName: namingStrategy.generatedEntityDeclarationNames.oneNotNull(
        model.typeName,
      ),
      description: namingStrategy.generatedEntityDeclarationDescriptions.oneNotNull(
        model.typeName,
      ),
      args: [queryArgs],
    })
    DeclarationHelper.pushQuery(appMetadata.queries, {
      ...model,
      array: true,
      propertyName: namingStrategy.generatedEntityDeclarationNames.many(
        model.typeName,
      ),
      description: namingStrategy.generatedEntityDeclarationDescriptions.many(
        model.typeName,
      ),
      args: [queryArgs],
    })
    DeclarationHelper.pushQuery(appMetadata.queries, {
      ...TypeMetadataUtils.create("number"),
      propertyName: namingStrategy.generatedEntityDeclarationNames.count(
        model.typeName,
      ),
      description: namingStrategy.generatedEntityDeclarationDescriptions.count(
        model.typeName,
      ),
      args: [whereArgs],
    })

    // ------------------------------------------------------------
    // register root mutations
    // ------------------------------------------------------------

    DeclarationHelper.pushMutation(appMetadata.mutations, {
      ...model,
      propertyName: namingStrategy.generatedEntityDeclarationNames.save(
        model.typeName,
      ),
      description: namingStrategy.generatedEntityDeclarationDescriptions.save(
        model.typeName,
      ),
      args: [saveArgs],
    })
    DeclarationHelper.pushMutation(appMetadata.mutations, {
      ...TypeMetadataUtils.create("boolean"),
      propertyName: namingStrategy.generatedEntityDeclarationNames.remove(
        model.typeName,
      ),
      description: namingStrategy.generatedEntityDeclarationDescriptions.remove(
        model.typeName,
      ),
      args: [whereArgs],
    })

    // ------------------------------------------------------------
    // register root subscriptions
    // ------------------------------------------------------------

    if (pubSub) {
      DeclarationHelper.pushSubscription(appMetadata.subscriptions, {
        ...model,
        propertyName: namingStrategy.generatedEntityDeclarationNames.observeInsert(
          model.typeName,
        ),
        description: namingStrategy.generatedEntityDeclarationDescriptions.observeInsert(
          model.typeName,
        ),
        // args: whereArgs,
      })
      DeclarationHelper.pushSubscription(appMetadata.subscriptions, {
        ...model,
        propertyName: namingStrategy.generatedEntityDeclarationNames.observeUpdate(
          model.typeName,
        ),
        description: namingStrategy.generatedEntityDeclarationDescriptions.observeUpdate(
          model.typeName,
        ),
        // args: whereArgs,
      })
      DeclarationHelper.pushSubscription(appMetadata.subscriptions, {
        ...model,
        propertyName: namingStrategy.generatedEntityDeclarationNames.observeSave(
          model.typeName,
        ),
        description: namingStrategy.generatedEntityDeclarationDescriptions.observeSave(
          model.typeName,
        ),
        // args: whereArgs,
      })
      DeclarationHelper.pushSubscription(appMetadata.subscriptions, {
        ...model,
        propertyName: namingStrategy.generatedEntityDeclarationNames.observeRemove(
          model.typeName,
        ),
        description: namingStrategy.generatedEntityDeclarationDescriptions.observeRemove(
          model.typeName,
        ),
        // args: whereArgs,
      })
      DeclarationHelper.pushSubscription(appMetadata.subscriptions, {
        ...model,
        propertyName: namingStrategy.generatedEntityDeclarationNames.observeOne(
          model.typeName,
        ),
        description: namingStrategy.generatedEntityDeclarationDescriptions.observeOne(
          model.typeName,
        ),
        args: [whereArgs],
      })
      DeclarationHelper.pushSubscription(appMetadata.subscriptions, {
        ...model,
        array: true,
        propertyName: namingStrategy.generatedEntityDeclarationNames.observeMany(
          model.typeName,
        ),
        description: namingStrategy.generatedEntityDeclarationDescriptions.observeMany(
          model.typeName,
        ),
        args: [queryArgs],
      })
      DeclarationHelper.pushSubscription(appMetadata.subscriptions, {
        ...TypeMetadataUtils.create("number"),
        propertyName: namingStrategy.generatedEntityDeclarationNames.observeCount(
          model.typeName,
        ),
        description: namingStrategy.generatedEntityDeclarationDescriptions.observeCount(
          model.typeName,
        ),
        args: [whereArgs],
      })
    }
  }
}
