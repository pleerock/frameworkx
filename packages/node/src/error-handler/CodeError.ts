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
