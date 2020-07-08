/**
 * CodeError is used to throw an Error with a "code" property that used as a convention,
 * along with message property. This "code" property can be used in client side to understand
 * what kind of error it is, without checking a dynamic message property.
 */
export class CodeError extends Error {
  instanceof: "CodeError"
  code: string

  constructor(code: string, message: string) {
    super(message)
    this.instanceof = "CodeError"
    this.code = code
    Object.setPrototypeOf(this, CodeError.prototype)
  }
}
