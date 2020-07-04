export class HttpError extends Error {
  instanceof: "HttpError"
  httpCode: number
  code?: string

  constructor(httpCode: number, code: string, message: string)
  constructor(httpCode: number, message: string)
  constructor(httpCode: number, codeOrMessage: string, maybeMessage?: string) {
    const message = arguments.length === 3 ? maybeMessage : codeOrMessage
    const code = arguments.length === 3 ? codeOrMessage : undefined
    super(message)
    this.instanceof = "HttpError"
    this.httpCode = httpCode
    if (code) this.code = code
    Object.setPrototypeOf(this, HttpError.prototype)
  }
}
