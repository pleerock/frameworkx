import {ValidateModelFn, ValidationSchema} from "..";
import {ContextList, Model} from "../../app";

/**
 * Model validation definition.
 *
 * todo: please merge me with InputValidator and call me ValidationRule
 */
export class ModelValidator<Blueprint, Context extends ContextList> {
  modelName: string
  validationSchema?: ValidationSchema<Blueprint, Context>
  modelValidator?: ValidateModelFn<Blueprint, Context>

  constructor(modelName: string, schema?: ValidationSchema<Blueprint, Context>) {
    this.modelName = modelName
    this.validationSchema = schema
  }

  schema(schema: ValidationSchema<Blueprint, Context>) {
    this.validationSchema = schema
    return this
  }

  validate(validator: ValidateModelFn<Blueprint, Context>) {
    this.modelValidator = validator
    return this
  }

}
