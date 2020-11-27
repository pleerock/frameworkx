/**
 * Error class for errors thrown by framework validation.
 */
export class ValidationError extends Error {
  "@type": "ValidationError"
  code: string

  constructor(code: string, message: string) {
    super(message)
    this["@type"] = "ValidationError"
    this.code = code
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}
