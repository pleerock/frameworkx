import {
  AnyValidationRule,
  TypeMetadata,
  TypeMetadataUtils,
  Validator,
} from "@microframework/core"

/**
 * Helper over validation operations.
 */
export class ValidationHelper {
  private validator: Validator
  private validationRules: AnyValidationRule[]

  constructor(validator: Validator, validationRules: AnyValidationRule[]) {
    this.validator = validator
    this.validationRules = validationRules
  }

  /**
   * Validates given input or model.
   */
  async validate(
    metadata: TypeMetadata,
    value: any,
    context: any,
  ): Promise<void> {
    // skip if validator wasn't defined in application bootstrap
    if (!this.validator) return
    if (value === undefined || value === null) return
    if (TypeMetadataUtils.isPrimitive(metadata)) return

    if (metadata.array === true) {
      for (const subVal of value) {
        await this.validate({ ...metadata, array: false }, subVal, context)
      }
    } else {
      // find given input/model validators
      let validationRules = this.validationRules.filter((validator) => {
        return validator.name === metadata.typeName
      })

      // if validator has validate function specified, use it
      for (const validationRule of validationRules) {
        if (validationRule.options.validate) {
          let result = validationRule.options.validate(value, context)
          if (result) await result
        }
      }

      // validate metadata properties
      for (const key in metadata.properties) {
        const property = metadata.properties[key]

        for (const validator of validationRules) {
          if (validator.options.projection) {
            const validationSchema =
              validator.options.projection[property.propertyName!!]
            if (validationSchema) {
              if (validationSchema instanceof Function) {
                let result = validationSchema(
                  value[property.propertyName!!],
                  value,
                  context,
                )
                if (result instanceof Promise) {
                  result = await result
                }
                value[property.propertyName!!] = result
              } else {
                await this.validator({
                  key: property.propertyName!!,
                  value: value[property.propertyName!!],
                  constraints: validationSchema,
                })
              }
            }
          }
        }

        // if its a sub-object validate nested properties
        if (TypeMetadataUtils.isPrimitive(property) === false) {
          await this.validate(property, value[property.propertyName!!], context)
        }
      }
    }
  }
}
