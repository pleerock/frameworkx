import {
  ApplicationTypeMetadata,
  TypeMetadataUtils,
} from "@microframework/core"
import { DataSource, InsertEvent } from "typeorm"
import { ApplicationServerProperties } from "../application-server"
import {
  DeclarationHelper,
  EntitySchemaArgsHelper,
  ResolverHelper,
} from "./entity-schema-builder-utils"
import { joinStrings } from "@microframework/parser"

const ParserUtils = {
  joinStrings: joinStrings,
}

/**
 * Generates root declarations type metadatas and resolvers for them.
 */
export function generateEntityResolvers(
  appMetadata: ApplicationTypeMetadata,
  properties: ApplicationServerProperties,
  dataSource: DataSource,
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
      (args: any) => {
        const input = JSON.parse(JSON.stringify(args.input))
        return dataSource.getRepository(entityMetadata.name).save(input)
      },
    )

    ResolverHelper.pushResolver(
      properties.resolvers,
      "mutation",
      namingStrategy.generatedEntityDeclarationNames.remove(model.typeName),
      async (args: any) => {
        const where = JSON.parse(JSON.stringify(args.where))
        await dataSource.getRepository(entityMetadata.name).remove(where)
        return true
      },
    )

    // ------------------------------------------------------------
    // register subscription resolvers
    // ------------------------------------------------------------

    if (pubSub) {
      const manyTriggerName =
        namingStrategy.generatedEntityDeclarationNames.observeManyTriggerName(
          entityMetadata.name,
        )
      const oneTriggerName =
        namingStrategy.generatedEntityDeclarationNames.observeOneTriggerName(
          entityMetadata.name,
        )
      const countTriggerName =
        namingStrategy.generatedEntityDeclarationNames.observeCountTriggerName(
          entityMetadata.name,
        )
      const insertTriggerName =
        namingStrategy.generatedEntityDeclarationNames.observeInsertTriggerName(
          entityMetadata.name,
        )
      const saveTriggerName =
        namingStrategy.generatedEntityDeclarationNames.observeSaveTriggerName(
          entityMetadata.name,
        )
      const updateTriggerName =
        namingStrategy.generatedEntityDeclarationNames.observeInsertTriggerName(
          entityMetadata.name,
        )
      const removeTriggerName =
        namingStrategy.generatedEntityDeclarationNames.observeRemoveTriggerName(
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

      /*ResolverHelper.pushResolver(
        properties.resolvers,
        "subscription",
        namingStrategy.generatedEntityDeclarationNames.observeOne(
          model.typeName,
        ),
        {
          triggers: [oneTriggerName],
          onSubscribe: (args: any, context: any) => {
            // console.log("subscribed", args)
            const where = JSON.parse(JSON.stringify(args.where)) // temporary fix for args being typeof object but not instanceof Object
            const order = JSON.parse(JSON.stringify(args.order)) // temporary fix for args being typeof object but not instanceof Object

            context.observeOneEntitySubscription = dataSource.manager
              .getRepository(entityMetadata.name)
              .observeOne({ where, order })
              .subscribe((entity) => {
                // console.log("trigger", oneTriggerName)
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
            const where = JSON.parse(JSON.stringify(args.where)) // temporary fix for args being typeof object but not instanceof Object
            const order = JSON.parse(JSON.stringify(args.order)) // temporary fix for args being typeof object but not instanceof Object
            context.observeOneEntitySubscription = dataSource.manager
              .getRepository(entityMetadata.name)
              .observe({
                where,
                order,
              })
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
            const where = JSON.parse(JSON.stringify(args.where)) // temporary fix for args being typeof object but not instanceof Object

            context.observeOneEntitySubscription = dataSource.manager
              .getRepository(entityMetadata.name)
              .observeCount(where)
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
      )*/
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
      ParserUtils.joinStrings(model.typeName, "Where", "Args"),
    )
    const orderArgsProperties = EntitySchemaArgsHelper.createOrderByArgs(
      appMetadata,
      properties,
      entityMetadata,
      model,
      0,
      ParserUtils.joinStrings(model.typeName, "OrderBy", "Args"),
    )
    const saveArgsProperties = EntitySchemaArgsHelper.createSaveArgs(
      appMetadata,
      properties,
      entityMetadata,
      model,
      0,
      ParserUtils.joinStrings(model.typeName, "Save", "Args"),
    )

    const whereArgs = TypeMetadataUtils.create("object", {
      typeName: namingStrategy.generatedEntityDeclarationArgsInputs.where(
        model.typeName!!,
      ),
      propertyName: "where",
      propertyPath: ParserUtils.joinStrings(
        model.typeName,
        "GeneratedWhere",
        "Args",
        "where",
      ),
      nullable: true,
      properties: whereArgsProperties,
    })

    const orderByArgs = TypeMetadataUtils.create("object", {
      typeName: namingStrategy.generatedEntityDeclarationArgsInputs.order(
        model.typeName!!,
      ),
      propertyName: "order",
      propertyPath: ParserUtils.joinStrings(
        model.typeName,
        "GeneratedOrder",
        "Args",
        "order",
      ),
      nullable: true,
      properties: orderArgsProperties,
    })

    const queryArgs = TypeMetadataUtils.create("object", {
      nullable: true,
      properties: [whereArgs, orderByArgs],
      propertyPath: ParserUtils.joinStrings(
        model.typeName,
        "GeneratedFind",
        "Args",
      ),
    })

    const saveInputArgs = TypeMetadataUtils.create("object", {
      typeName: namingStrategy.generatedEntityDeclarationArgsInputs.save(
        model.typeName!!,
      ),
      properties: saveArgsProperties,
      propertyName: "input",
      propertyPath: ParserUtils.joinStrings(
        model.typeName,
        "GeneratedSave",
        "Args",
        "input",
      ),
    })

    const saveArgs = TypeMetadataUtils.create("object", {
      nullable: true,
      properties: [saveInputArgs],
      propertyPath: ParserUtils.joinStrings(
        model.typeName,
        "GeneratedSave",
        "Args",
      ),
    })

    // ------------------------------------------------------------
    // register root queries
    // ------------------------------------------------------------

    // console.log("queryArgs", model.typeName!!, queryArgs)
    DeclarationHelper.pushQuery(
      appMetadata.queries,
      TypeMetadataUtils.create("function", {
        propertyName: namingStrategy.generatedEntityDeclarationNames.one(
          model.typeName,
        ),
        propertyPath: namingStrategy.generatedEntityDeclarationNames.one(
          model.typeName,
        ),
        description: namingStrategy.generatedEntityDeclarationDescriptions.one(
          model.typeName,
        ),
        returnType: TypeMetadataUtils.create("reference", {
          typeName: model.typeName,
          propertyPath: ParserUtils.joinStrings(
            namingStrategy.generatedEntityDeclarationNames.one(model.typeName),
            "Return",
          ),
          nullable: true,
        }),
        args: [queryArgs],
      }),
    )
    DeclarationHelper.pushQuery(
      appMetadata.queries,
      TypeMetadataUtils.create("function", {
        propertyName: namingStrategy.generatedEntityDeclarationNames.oneNotNull(
          model.typeName,
        ),
        propertyPath: namingStrategy.generatedEntityDeclarationNames.oneNotNull(
          model.typeName,
        ),
        description:
          namingStrategy.generatedEntityDeclarationDescriptions.oneNotNull(
            model.typeName,
          ),
        returnType: TypeMetadataUtils.create("reference", {
          typeName: model.typeName,
          propertyPath: ParserUtils.joinStrings(
            namingStrategy.generatedEntityDeclarationNames.oneNotNull(
              model.typeName,
            ),
            "Return",
          ),
          nullable: false,
        }),
        args: [queryArgs],
      }),
    )
    DeclarationHelper.pushQuery(
      appMetadata.queries,
      TypeMetadataUtils.create("function", {
        propertyName: namingStrategy.generatedEntityDeclarationNames.many(
          model.typeName,
        ),
        propertyPath: namingStrategy.generatedEntityDeclarationNames.many(
          model.typeName,
        ),
        description: namingStrategy.generatedEntityDeclarationDescriptions.many(
          model.typeName,
        ),
        returnType: TypeMetadataUtils.create("reference", {
          typeName: model.typeName,
          propertyPath: ParserUtils.joinStrings(
            namingStrategy.generatedEntityDeclarationNames.many(model.typeName),
            "Return",
          ),
          array: true,
        }),
        args: [queryArgs],
      }),
    )
    DeclarationHelper.pushQuery(
      appMetadata.queries,
      TypeMetadataUtils.create("function", {
        propertyName: namingStrategy.generatedEntityDeclarationNames.count(
          model.typeName,
        ),
        propertyPath: namingStrategy.generatedEntityDeclarationNames.count(
          model.typeName,
        ),
        description:
          namingStrategy.generatedEntityDeclarationDescriptions.count(
            model.typeName,
          ),
        returnType: TypeMetadataUtils.create("number", {
          propertyPath: ParserUtils.joinStrings(
            namingStrategy.generatedEntityDeclarationNames.count(
              model.typeName,
            ),
            "Return",
          ),
        }),
        args: [
          TypeMetadataUtils.create("object", {
            nullable: true,
            properties: [whereArgs],
            propertyPath: ParserUtils.joinStrings(
              model.typeName,
              "GeneratedCount",
              "Args",
            ),
          }),
        ],
      }),
    )

    // ------------------------------------------------------------
    // register root mutations
    // ------------------------------------------------------------

    DeclarationHelper.pushMutation(
      appMetadata.mutations,
      TypeMetadataUtils.create("function", {
        propertyName: namingStrategy.generatedEntityDeclarationNames.save(
          model.typeName,
        ),
        propertyPath: namingStrategy.generatedEntityDeclarationNames.save(
          model.typeName,
        ),
        description: namingStrategy.generatedEntityDeclarationDescriptions.save(
          model.typeName,
        ),
        returnType: TypeMetadataUtils.create("reference", {
          typeName: model.typeName,
          propertyPath: ParserUtils.joinStrings(
            namingStrategy.generatedEntityDeclarationNames.save(model.typeName),
            "Return",
          ),
        }),
        args: [saveArgs],
      }),
    )

    DeclarationHelper.pushMutation(
      appMetadata.mutations,
      TypeMetadataUtils.create("function", {
        propertyName: namingStrategy.generatedEntityDeclarationNames.remove(
          model.typeName,
        ),
        propertyPath: namingStrategy.generatedEntityDeclarationNames.remove(
          model.typeName,
        ),
        description:
          namingStrategy.generatedEntityDeclarationDescriptions.remove(
            model.typeName,
          ),
        returnType: TypeMetadataUtils.create("boolean", {
          propertyPath: ParserUtils.joinStrings(
            namingStrategy.generatedEntityDeclarationNames.remove(
              model.typeName,
            ),
            "Return",
          ),
        }),
        args: [
          TypeMetadataUtils.create("object", {
            properties: [{ ...whereArgs, nullable: false }],
            propertyPath: ParserUtils.joinStrings(
              model.typeName,
              "GeneratedRemove",
              "Args",
            ),
          }),
        ],
      }),
    )

    // ------------------------------------------------------------
    // register root subscriptions
    // ------------------------------------------------------------

    if (pubSub) {
      DeclarationHelper.pushSubscription(
        appMetadata.subscriptions,
        TypeMetadataUtils.create("function", {
          propertyName:
            namingStrategy.generatedEntityDeclarationNames.observeInsert(
              model.typeName,
            ),
          propertyPath:
            namingStrategy.generatedEntityDeclarationNames.observeInsert(
              model.typeName,
            ),
          description:
            namingStrategy.generatedEntityDeclarationDescriptions.observeInsert(
              model.typeName,
            ),
          returnType: TypeMetadataUtils.create("reference", {
            typeName: model.typeName,
            propertyPath: ParserUtils.joinStrings(
              namingStrategy.generatedEntityDeclarationNames.observeInsert(
                model.typeName,
              ),
              "Return",
            ),
          }),
          args: [
            /*whereArgs*/
          ],
        }),
      )
      DeclarationHelper.pushSubscription(
        appMetadata.subscriptions,
        TypeMetadataUtils.create("function", {
          propertyName:
            namingStrategy.generatedEntityDeclarationNames.observeUpdate(
              model.typeName,
            ),
          propertyPath:
            namingStrategy.generatedEntityDeclarationNames.observeUpdate(
              model.typeName,
            ),
          description:
            namingStrategy.generatedEntityDeclarationDescriptions.observeUpdate(
              model.typeName,
            ),
          returnType: TypeMetadataUtils.create("reference", {
            typeName: model.typeName,
            propertyPath: ParserUtils.joinStrings(
              namingStrategy.generatedEntityDeclarationNames.observeUpdate(
                model.typeName,
              ),
              "Return",
            ),
          }),
          args: [
            /*whereArgs*/
          ],
        }),
      )
      DeclarationHelper.pushSubscription(
        appMetadata.subscriptions,
        TypeMetadataUtils.create("function", {
          propertyName:
            namingStrategy.generatedEntityDeclarationNames.observeSave(
              model.typeName,
            ),
          propertyPath:
            namingStrategy.generatedEntityDeclarationNames.observeSave(
              model.typeName,
            ),
          description:
            namingStrategy.generatedEntityDeclarationDescriptions.observeSave(
              model.typeName,
            ),
          returnType: TypeMetadataUtils.create("reference", {
            typeName: model.typeName,
            propertyPath: ParserUtils.joinStrings(
              namingStrategy.generatedEntityDeclarationNames.observeSave(
                model.typeName,
              ),
              "Return",
            ),
          }),
          args: [
            /*whereArgs*/
          ],
        }),
      )
      DeclarationHelper.pushSubscription(
        appMetadata.subscriptions,
        TypeMetadataUtils.create("function", {
          propertyName:
            namingStrategy.generatedEntityDeclarationNames.observeRemove(
              model.typeName,
            ),
          propertyPath:
            namingStrategy.generatedEntityDeclarationNames.observeRemove(
              model.typeName,
            ),
          description:
            namingStrategy.generatedEntityDeclarationDescriptions.observeRemove(
              model.typeName,
            ),
          returnType: TypeMetadataUtils.create("reference", {
            typeName: model.typeName,
            propertyPath: ParserUtils.joinStrings(
              namingStrategy.generatedEntityDeclarationNames.observeRemove(
                model.typeName,
              ),
              "Return",
            ),
          }),
          args: [
            /*whereArgs*/
          ],
        }),
      )
      DeclarationHelper.pushSubscription(
        appMetadata.subscriptions,
        TypeMetadataUtils.create("function", {
          propertyName:
            namingStrategy.generatedEntityDeclarationNames.observeOne(
              model.typeName,
            ),
          propertyPath:
            namingStrategy.generatedEntityDeclarationNames.observeOne(
              model.typeName,
            ),
          description:
            namingStrategy.generatedEntityDeclarationDescriptions.observeOne(
              model.typeName,
            ),
          returnType: TypeMetadataUtils.create("reference", {
            typeName: model.typeName,
            propertyPath: ParserUtils.joinStrings(
              namingStrategy.generatedEntityDeclarationNames.observeOne(
                model.typeName,
              ),
              "Return",
            ),
          }),
          args: [queryArgs],
        }),
      )
      DeclarationHelper.pushSubscription(
        appMetadata.subscriptions,
        TypeMetadataUtils.create("function", {
          propertyName:
            namingStrategy.generatedEntityDeclarationNames.observeMany(
              model.typeName,
            ),
          propertyPath:
            namingStrategy.generatedEntityDeclarationNames.observeMany(
              model.typeName,
            ),
          description:
            namingStrategy.generatedEntityDeclarationDescriptions.observeMany(
              model.typeName,
            ),
          returnType: TypeMetadataUtils.create("reference", {
            typeName: model.typeName,
            array: true,
            propertyPath: ParserUtils.joinStrings(
              namingStrategy.generatedEntityDeclarationNames.observeMany(
                model.typeName,
              ),
              "Return",
            ),
          }),
          args: [queryArgs],
        }),
      )
      DeclarationHelper.pushSubscription(
        appMetadata.subscriptions,
        TypeMetadataUtils.create("function", {
          propertyName:
            namingStrategy.generatedEntityDeclarationNames.observeCount(
              model.typeName,
            ),
          propertyPath:
            namingStrategy.generatedEntityDeclarationNames.observeCount(
              model.typeName,
            ),
          description:
            namingStrategy.generatedEntityDeclarationDescriptions.observeCount(
              model.typeName,
            ),
          returnType: TypeMetadataUtils.create("number", {
            typeName: model.typeName,
            propertyPath: ParserUtils.joinStrings(
              namingStrategy.generatedEntityDeclarationNames.observeCount(
                model.typeName,
              ),
              "Return",
            ),
          }),
          args: [
            TypeMetadataUtils.create("object", {
              properties: [{ ...whereArgs, nullable: false }],
              propertyPath: ParserUtils.joinStrings(
                model.typeName,
                "GeneratedCount",
                "Args",
              ),
            }),
          ],
        }),
      )
    }
  }
}
