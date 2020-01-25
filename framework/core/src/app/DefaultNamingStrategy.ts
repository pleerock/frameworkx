import {NamingStrategy} from "./NamingStrategy";

/**
 * Default framework naming strategy.
 */
export const DefaultNamingStrategy: NamingStrategy = {

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
  },
  generatedModelInputs: {
    where(typeName: string) {
      return capitalize(camelize(typeName + " Where"))
    },
    order(typeName: string) {
      return capitalize(camelize(typeName + " OrderBy"))
    },
    whereRelation(typeName: string, relationName: string) {
      return capitalize(camelize(typeName + " " + relationName + " InWhere"))
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
