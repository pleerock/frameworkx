import {AnyApplication, InputValidator, MetadataUtils, ModelValidator, TypeMetadata} from "@microframework/core"

// todo: I don't think we need separate InputValidator and ModelValidator and this type flag in this function

/**
 * Validates given input or model.
 */
export async function validate(
  type: "input" | "model",
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
  if (MetadataUtils.isTypePrimitive(metadata))
    return

  if (metadata.array === true) {
    for (const subVal of value) {
      await validate(type, app, {...metadata, array: false}, subVal, context)
    }

  } else {

    // find given input/model validators
    let validators: (InputValidator<any, any> | ModelValidator<any, any>)[] = []
    if (type === "input") {
      validators = app
        .properties
        .validationRules
        .filter(validator => {
          if (validator instanceof InputValidator && validator.inputName === metadata.typeName) {
            return true
          }
          return false
        })

    } else if (type === "model") {
      validators = app
        .properties
        .validationRules
        .filter(validator => {
          if (validator instanceof ModelValidator && validator.modelName === metadata.typeName) {
            return true
          }
          return false
        })
    }

    // if validator has validate function specified, use it
    for (const validator of validators) {
      if (validator.modelValidator) {
        let result = validator.modelValidator(value, context)
        if (result) await result
      }
    }

    // validate metadata properties
    for (const key in metadata.properties) {
      const property = metadata.properties[key]

      for (const validator of validators) {
        if (validator.validationSchema) {
          const validationSchema = validator.validationSchema[property.propertyName!!]
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
      if (MetadataUtils.isTypePrimitive(property) === false) {
        await validate(type, app, property, value[property.propertyName!!], context)
      }
    }
  }
}