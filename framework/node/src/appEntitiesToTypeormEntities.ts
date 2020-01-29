import {
  AnyApplication,
  EntitySchemaRelationArrayOptions,
  EntitySchemaRelationOneOptions,
  ModelEntity,
} from "@microframework/core";
import {EntitySchema as TypeormEntitySchema, EntitySchemaColumnOptions} from "typeorm";
import { isModel } from "../../model/src";

/**
 * Transforms entities defined in the app to TypeORM entity format.
 * Should be used to pass app entities to TypeORM connection object.
 */
export function appEntitiesToTypeormEntities(app: AnyApplication, entitiesOrMap: ModelEntity<any>[] | { [key: string]: ModelEntity<any> }) {
  const entities = entitiesOrMap instanceof Array ? entitiesOrMap : Object.keys(entitiesOrMap).map(key => entitiesOrMap[key])
  return entities.map(entity => {

    const columns = Object.keys(entity.entitySchema!).reduce((columns, key) => {
      const options = entity.entitySchema![key]!
      if (isColumnInEntitySchema(options)) {
        return {
          ...columns,
          [key]: options
        }
      }
      return columns
    }, {})

    const relations = Object.keys(entity.entitySchema!).reduce((relations, key) => {
      const options = entity.entitySchema![key]!
      if (isRelationInEntitySchema(options)) {
        let relationType = options.relation

        const modelMetadata = app.metadata.models.find(model => model.typeName === entity.name)
        if (!modelMetadata)
          throw new Error("Model was not found")
        const modelProperty = modelMetadata.properties.find(property => property.propertyName === key)
        if (!modelProperty)
          throw new Error("Property was not found")

        let target = modelProperty.typeName
        return {
          ...relations,
          [key]: {
            target: target,
            type: relationType,
            inverseSide: (options as { inverseSide: string }).inverseSide,
            joinColumn: (options as { joinColumn: boolean }).joinColumn,
            joinTable: (options as any /*todo { joinTable: boolean }*/).joinTable,
          }
        }
      }
      return relations
    }, {})

    return new TypeormEntitySchema({
      name: isModel(entity.name) ? entity.name.name : entity.name,
      tableName: entity.tableName,
      columns,
      relations,
    })
  })
}

function isColumnInEntitySchema(property: any): property is EntitySchemaColumnOptions {
  return property.type !== undefined
}

function isRelationInEntitySchema(property: any): property is EntitySchemaRelationOneOptions | EntitySchemaRelationArrayOptions {
  return property.relation !== undefined
}
