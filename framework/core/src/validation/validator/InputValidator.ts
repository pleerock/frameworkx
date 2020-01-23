import {ValidateInputFn, ValidationSchema} from "..";
import {ContextList} from "../../app";

/**
 * Input validation definition.
 */
export class InputValidator<Blueprint, Context extends ContextList> {
  inputName: string
  validationSchema?: ValidationSchema<Blueprint, Context>
  modelValidator?: ValidateInputFn<Blueprint, Context>

  constructor(inputName: string, schema?: ValidationSchema<Blueprint, Context>) {
    this.inputName = inputName
    this.validationSchema = schema
  }

  schema(schema: ValidationSchema<Blueprint, Context>) {
    this.validationSchema = schema
    return this
  }

  validate(validator: ValidateInputFn<Blueprint, Context>) {
    this.modelValidator = validator
    return this
  }

}
