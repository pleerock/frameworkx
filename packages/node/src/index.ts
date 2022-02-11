import { EntitySchemaOptions } from "typeorm/entity-schema/EntitySchemaOptions"
import { EntitySchema } from "typeorm"

export * from "./error-handler"
export * from "./naming-strategy"
export * from "./rate-limit"
export * from "./application-server"
export * from "./entity-schema-builder/entity-schema-builder-fn"
export * from "./resolver/ResolverHelper"
export * from "./util/validation-utils"
export * from "./swagger-generator"

export function entity<T>(
  name: string | { type: T; name: string },
  options: Omit<EntitySchemaOptions<T>, "name">,
) {
  const entityName = typeof name === "string" ? name : name.name
  return new EntitySchema({
    name: entityName,
    ...options,
  })
}
