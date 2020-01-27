import {ApplicationProperties, ContextList, Input} from "../app";
import {InputValidator, ValidationSchema} from "../validation";

/**
 * Input manager.
 */
export class InputManager<
  I extends Input,
  Context extends ContextList
  > {

  /**
   * Input instance.
   */
  readonly _input!: I

  /**
   * Application's properties.
   */
  readonly appProperties: ApplicationProperties

  /**
   * Input name.
   */
  readonly name: string

  constructor(
    appProperties: ApplicationProperties,
    name: string,
  ) {
    this.appProperties = appProperties
    this.name = name
  }

  /**
   * Registers a new input validator.
   */
  validator(schema: ValidationSchema<I, Context>): InputValidator<I, Context> {
    return new InputValidator(this.name, schema)
  }

}

export function validator<T>(name: string, schema: ValidationSchema<T, any>) {
  return new InputValidator(name, schema)
}
