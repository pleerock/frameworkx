/**
 * Strategy for naming special identifiers used in the framework.
 */
export type NamingStrategy = {

  /**
   * Defines how generated root queries and mutations will be named.
   */
  generatedModelDeclarations: {
    one(modelName: string): string
    oneNotNull(modelName: string): string
    many(modelName: string): string
    count(modelName: string): string
    save(modelName: string): string
    remove(modelName: string): string
    observeOne(modelName: string): string
    observeMany(modelName: string): string
    observeCount(modelName: string): string
    observeInsert(modelName: string): string
    observeUpdate(modelName: string): string
    observeSave(modelName: string): string
    observeRemove(modelName: string): string
    observeOneTriggerName(modelName: string): string
    observeManyTriggerName(modelName: string): string
    observeCountTriggerName(modelName: string): string
    observeInsertTriggerName(modelName: string): string
    observeUpdateTriggerName(modelName: string): string
    observeSaveTriggerName(modelName: string): string
    observeRemoveTriggerName(modelName: string): string
  }

  generatedModelDeclarationDescriptions: {
    one(modelName: string): string
    oneNotNull(modelName: string): string
    many(modelName: string): string
    count(modelName: string): string
    save(modelName: string): string
    remove(modelName: string): string
    observeOne(modelName: string): string
    observeMany(modelName: string): string
    observeCount(modelName: string): string
    observeInsert(modelName: string): string
    observeUpdate(modelName: string): string
    observeSave(modelName: string): string
    observeRemove(modelName: string): string
  }

  generatedModelInputs: {
    where(typeName: string): string
    order(typeName: string): string
    whereRelation(typeName: string, relationName: string): string
  }


}
