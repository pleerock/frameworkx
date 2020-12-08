import { DefaultNamingStrategy as GraphQLSchemaDefaultNamingStrategy } from "@microframework/graphql"
import { NamingStrategy } from "./naming-strategy-type"
import { NamingStrategyUtils } from "./naming-strategy-utils"

const { capitalize, smallize, camelize } = NamingStrategyUtils

/**
 * Default framework naming strategy.
 */
export const DefaultNamingStrategy: NamingStrategy = {
  generatedGraphQLTypes: GraphQLSchemaDefaultNamingStrategy,
  generatedEntityModelNames: {
    one(modelName: string) {
      return smallize(`${modelName}One`)
    },
    oneNotNull(modelName: string) {
      return smallize(`${modelName}NotNullOne`)
    },
    many(modelName: string) {
      return smallize(`${modelName}Many`)
    },
    count(modelName: string) {
      return smallize(`${modelName}Count`)
    },
    save(modelName: string) {
      return smallize(`${modelName}Save`)
    },
    remove(modelName: string) {
      return smallize(`${modelName}Remove`)
    },
    observeOne(modelName: string) {
      return smallize(modelName + "ObserveOne")
    },
    observeMany(modelName: string) {
      return smallize(modelName + "ObserveMany")
    },
    observeCount(modelName: string) {
      return smallize(modelName + "ObserveCount")
    },
    observeInsert(modelName: string) {
      return smallize(modelName + "ObserveInsert")
    },
    observeUpdate(modelName: string) {
      return smallize(modelName + "ObserveUpdate")
    },
    observeSave(modelName: string) {
      return smallize(modelName + "ObserveSave")
    },
    observeRemove(modelName: string) {
      return smallize(modelName + "ObserveRemove")
    },
    observeOneTriggerName(modelName: string) {
      return modelName + "ObserveOne"
    },
    observeManyTriggerName(modelName: string) {
      return modelName + "ObserveMany"
    },
    observeCountTriggerName(modelName: string) {
      return modelName + "ObserveCount"
    },
    observeInsertTriggerName(modelName: string) {
      return modelName + "ObserveInsert"
    },
    observeUpdateTriggerName(modelName: string) {
      return modelName + "ObserveUpdate"
    },
    observeSaveTriggerName(modelName: string) {
      return modelName + "ObserveSave"
    },
    observeRemoveTriggerName(modelName: string) {
      return modelName + "ObserveRemove"
    },
  },
  generatedEntityModelDescriptions: {
    one(modelName: string) {
      return `Loads a single instance of the "${modelName}" model. Returns null if model not found.`
    },
    oneNotNull(modelName: string) {
      return `Loads a single instance of the "${modelName}" model. Returns error if model not found. `
    },
    many(modelName: string) {
      return `Loads multiple instances of the "${modelName}" model.`
    },
    count(modelName: string) {
      return `Counts number of "${modelName}" model instances.`
    },
    save(modelName: string) {
      return `Saves a provided "${modelName}" model.`
    },
    remove(modelName: string) {
      return `Removes a provided "${modelName}" model.`
    },
    observeOne(modelName: string) {
      return `Observes changes of the "${modelName}" model.`
    },
    observeMany(modelName: string) {
      return `Observes changes of the "${modelName}" models.`
    },
    observeCount(modelName: string) {
      return `Observes number of the "${modelName}" model instances.`
    },
    observeInsert(modelName: string) {
      return `Observes inserts of the "${modelName}" model.`
    },
    observeUpdate(modelName: string) {
      return `Observes updates of the "${modelName}" model.`
    },
    observeSave(modelName: string) {
      return `Observes changes of the "${modelName}" model.`
    },
    observeRemove(modelName: string) {
      return `Observes removals of the "${modelName}" model.`
    },
  },
  generatedEntityModelArgs: {
    where(typeName: string) {
      return capitalize(camelize(typeName + " Where"))
    },
    save(typeName: string) {
      return capitalize(camelize(typeName + " Save"))
    },
    order(typeName: string) {
      return capitalize(camelize(typeName + " OrderBy"))
    },
    whereRelation(typeName: string, relationName: string) {
      return capitalize(camelize(typeName + " " + relationName + " InWhere"))
    },
    saveRelation(typeName: string, relationName: string) {
      return capitalize(camelize(typeName + " " + relationName + " InSave"))
    },
  },
}
