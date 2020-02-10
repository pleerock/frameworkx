import { NamingStrategy } from "./NamingStrategy"

/**
 * Default framework naming strategy.
 */
export const DefaultNamingStrategy: NamingStrategy = {

  namelessInput() {
    return generateRandomString(10) + "Input"
  },

  namelessModel() {
    return generateRandomString(10) + "Model"
  },

  defaultTypeName(type: "query" | "mutation" | "subscription"): string {
    return  (type === "query") ? "Query" :
            (type === "mutation") ? "Mutation" :
            (type === "subscription") ? "Subscription" :
            ""
  },

  defaultTypeDescription(type: "query" | "mutation" | "subscription"): string {
    return  (type === "query") ? "Root queries." :
            (type === "mutation") ? "Root mutations." :
            (type === "subscription") ? "Root subscriptions." :
            ""
  },

  generatedModelDeclarations: {
    one(modelName: string) {
      return lowercaseFirstLetter(`${modelName}One`)
    },
    oneNotNull(modelName: string) {
      return lowercaseFirstLetter(`${modelName}NotNullOne`)
    },
    many(modelName: string) {
      return lowercaseFirstLetter(`${modelName}Many`)
    },
    count(modelName: string) {
      return lowercaseFirstLetter(`${modelName}Count`)
    },
    save(modelName: string) {
      return lowercaseFirstLetter(`${modelName}Save`)
    },
    remove(modelName: string) {
      return lowercaseFirstLetter(`${modelName}Remove`)
    },
    observeOne(modelName: string) {
      return lowercaseFirstLetter(modelName + "ObserveOne")
    },
    observeMany(modelName: string) {
      return lowercaseFirstLetter(modelName + "ObserveMany")
    },
    observeCount(modelName: string) {
      return lowercaseFirstLetter(modelName + "ObserveCount")
    },
    observeInsert(modelName: string) {
      return lowercaseFirstLetter(modelName + "ObserveInsert")
    },
    observeUpdate(modelName: string) {
      return lowercaseFirstLetter(modelName + "ObserveUpdate")
    },
    observeSave(modelName: string) {
      return lowercaseFirstLetter(modelName + "ObserveSave")
    },
    observeRemove(modelName: string) {
      return lowercaseFirstLetter(modelName + "ObserveRemove")
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
  generatedModelDeclarationDescriptions: {
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
  generatedModelInputs: {
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

function lowercaseFirstLetter(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function camelize(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index == 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateRandomString(length: number) {
  let result = ""
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
