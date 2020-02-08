import {AnyApplication, ValidationRule, TypeMetadataUtils, TypeMetadata} from "@microframework/core"

/**
 * Validates given input or model.
 */
export async function validate(
  app: AnyApplication,
  metadata: TypeMetadata,
  value: any,
  context: any
): Promise<void> {

  // skip if validator wasn't defined in application bootstrap
  if (!app.properties.validator)
    return
  if (value === undefined || value === null)
    return
  if (TypeMetadataUtils.isTypePrimitive(metadata))
    return

  if (metadata.array === true) {
    for (const subVal of value) {
      await validate(app, {...metadata, array: false}, subVal, context)
    }

  } else {

    // find given input/model validators
    let validators: ValidationRule<any, any>[] = app
      .properties
      .validationRules
      .filter(validator => validator.name === metadata.typeName)


    // if validator has validate function specified, use it
    for (const validator of validators) {
      if (validator.options.validate) {
        let result = validator.options.validate(value, context)
        if (result) await result
      }
    }

    // validate metadata properties
    for (const key in metadata.properties) {
      const property = metadata.properties[key]

      for (const validator of validators) {
        if (validator.options.projection) {
          const validationSchema = validator.options.projection[property.propertyName!!]
          if (validationSchema) {
            if (validationSchema instanceof Function) {
              let result = validationSchema(value[property.propertyName!!], value, context)
              if (result instanceof Promise) {
                result = await result
              }
              value[property.propertyName!!] = result
            } else {
              app.properties.validator({
                key: property.propertyName!!,
                value: value[property.propertyName!!],
                options: validationSchema
              })
            }
          }
        }
      }

      // if its a sub-object validate nested properties
      if (TypeMetadataUtils.isTypePrimitive(property) === false) {
        await validate(app, property, value[property.propertyName!!], context)
      }
    }
  }
}
