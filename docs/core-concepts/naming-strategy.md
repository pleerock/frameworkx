# Naming Strategy

Using naming strategy you can customize automatically generated names and symbols in your project.

By default, Microframework ships its own naming strategy, but you can customize
it with your own naming strategy:

```typescript
type NamingStrategy = {
  generatedGraphQLTypes: {
    modelTypeName(type: TypeMetadata): string
    inputTypeName(type: TypeMetadata): string
    enumTypeName(type: TypeMetadata): string
    unionTypeName(type: TypeMetadata): string
    defaultTypeName(type: "query" | "mutation" | "subscription"): string
    defaultTypeDescription(type: "query" | "mutation" | "subscription"): string
  }
  generatedEntityDeclarationNames: {
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
  generatedEntityDeclarationDescriptions: {
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
  generatedEntityDeclarationArgsInputs: {
    where(typeName: string): string
    save(typeName: string): string
    order(typeName: string): string
    whereRelation(typeName: string, relationName: string): string
    saveRelation(typeName: string, relationName: string): string
  }
}
```

* `generatedGraphQLTypes` is used to generate names for the nameless
 GraphQL types that were inferred from the application declaration.
* `generatedEntityDeclarationNames` is used to generate names for the root declarations (queries, mutations, subscriptions)
 created for the entities. 
 Declarations generated when you have entities defined in the app 
 and `generateModelRootQueries` option is enabled in the application server options.
* `generatedEntityDeclarationDescriptions` is used to generate descriptions for the root declarations (queries, mutations, subscriptions)
  created for the entities. 
  Declarations generated when you have entities defined in the app 
  and `generateModelRootQueries` option is enabled in the application server options.
* `generatedEntityDeclarationArgsInputs` is used for the generated inputs of the generated root declarations.

To implement a custom naming strategy, you can re-define any of these methods, e.g.:

```typescript
import { NamingStrategy, DefaultNamingStrategy } from "@microframework/node"

const MyNamingStrategy: NamingStrategy = {
  ...DefaultNamingStrategy,
  generatedGraphQLTypes: {
    ...DefaultNamingStrategy.generatedGraphQLTypes,
    modelTypeName(type: TypeMetadata) {
      if (type.propertyPath === type.propertyName) {
        return type.propertyPath
      }
      return capitalize(camelize(type.propertyPath.replace(/\./g, " "))) + "GeneratedModel"
    },
  }
}
```

When custom naming strategy defined, you must specify it in the options:

```typescript
export const AppServer = createApplicationServer(App, {
  // ...
  namingStrategy: MyNamingStrategy
  // ...
})
```