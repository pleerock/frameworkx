import { AnyModel } from "@microframework/model";
import { ValidateModelFn, ValidationSchema } from "..";
import { ContextList } from "../../app";

/**
 * Model validation rule.
 */
export class ValidationRule<Blueprint, Context extends ContextList> {
  modelName: string | AnyModel
  validationSchema?: ValidationSchema<Blueprint, Context>
  modelValidator?: ValidateModelFn<Blueprint, Context>

  constructor(modelName: string | AnyModel, schema?: ValidationSchema<Blueprint, Context>) {
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
