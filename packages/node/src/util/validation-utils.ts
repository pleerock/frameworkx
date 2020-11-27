import {
  AnyValidationRule,
  TypeMetadata,
  TypeMetadataUtils,
  ValidationFn,
} from "@microframework/core"

/**
 * Validates a given value based on it's TypeMetadata.
 */
export async function validateTypeMetadata(
  validationFn: ValidationFn<any>,
  allValidationRules: AnyValidationRule[],
  metadata: TypeMetadata,
  value: any,
  context: any,
) {
  if (value === undefined || value === null) return
  if (TypeMetadataUtils.isPrimitive(metadata)) return

  // go recursively for an array metadata
  if (metadata.array === true) {
    for (const valueItem of value) {
      await validateTypeMetadata(
        validationFn,
        allValidationRules,
        { ...metadata, array: false },
        valueItem,
        context,
      )
    }
  } else {
    // find validation rules for a given metadata
    const metadataValidationRules = allValidationRules.filter((validator) => {
      return validator.name === metadata.typeName
    })

    // if validator has a custom validate function specified, use it
    for (const validationRule of metadataValidationRules) {
      if (validationRule.options.validate) {
        let result = validationRule.options.validate(value, context)
        if (result instanceof Promise) await result
      }
    }

    // validate metadata properties
    for (const key in metadata.properties) {
      const property = metadata.properties[key]

      for (const validationRule of metadataValidationRules) {
        if (validationRule.options.projection) {
          if (!property.propertyName) continue
          const validationSchema =
            validationRule.options.projection[property.propertyName]
          if (!validationSchema) continue

          // in the case if it's a function instead of pre-defined constraint
          if (validationSchema instanceof Function) {
            let result = validationSchema(
              value[property.propertyName],
              value,
              context,
            )
            if (result instanceof Promise) {
              result = await result
            }
            value[property.propertyName] = result
          } else {
            // in case if it's a constraint
            await validationFn({
              key: property.propertyName,
              value: value[property.propertyName],
              constraints: validationSchema,
            })
          }
        }
      }

      // if metadata is an object with nested properties, validate them too
      if (TypeMetadataUtils.isPrimitive(property) === false) {
        await validateTypeMetadata(
          validationFn,
          metadataValidationRules,
          property,
          value[property.propertyName!!],
          context,
        )
      }
    }
  }
}
