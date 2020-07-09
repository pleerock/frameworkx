/**
 * HttpError is used to throw an error with a custom HTTP status code.
 * For example, throw new HttpError(404, "User not found")
 * sets 404 HTTP status code in a response.
 */
export class HttpError extends Error {
  typeof: "HttpError"
  httpCode: number
  code?: string

  constructor(httpCode: number, code: string, message: string)
  constructor(httpCode: number, message: string)
  constructor(httpCode: number, codeOrMessage: string, maybeMessage?: string) {
    const message = arguments.length === 3 ? maybeMessage : codeOrMessage
    const code = arguments.length === 3 ? codeOrMessage : undefined
    super(message)
    this.typeof = "HttpError"
    this.httpCode = httpCode
    if (code) this.code = code
    Object.setPrototypeOf(this, HttpError.prototype)
  }
}
