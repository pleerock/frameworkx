import { TypeMetadata } from "@microframework/core";
import { parse } from "@microframework/parser";
import * as fs from "fs";
import * as path from "path";
import { MappedEntitySchemaProperty } from "typeorm";

/**
 * Application Server utility functions.
 */
export const ApplicationServerUtils = {

  /**
   * Loads application metadata from the declaration file.
   */
  loadAppMetadata(filenameWithoutExt: string) {
    const tsFilePath = path.normalize(filenameWithoutExt + ".ts")
    const dtsFilePath = path.normalize(filenameWithoutExt + ".d.ts")

    if (fs.existsSync(tsFilePath))
      return parse(tsFilePath)

    if (fs.existsSync(dtsFilePath))
      return parse(dtsFilePath)

    throw new Error(`${tsFilePath} or ${dtsFilePath} were not found!`)
  },

  /**
   * Converts given type metadata models into MappedEntitySchemaProperty objects.
   */
  modelsToApp(models: TypeMetadata[]): MappedEntitySchemaProperty[] {
    const mappedEntities: MappedEntitySchemaProperty[] = []
    for (let model of models) {
      for (let property of model.properties) {
        mappedEntities.push({
          model: model.typeName!,
          property: property.propertyName!,
          target: property.typeName!
        })
      }
    }
    return mappedEntities
  },

}
