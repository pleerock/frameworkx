/**
 * CodeError is used to throw an Error with a "code" property that used as a convention,
 * along with message property. This "code" property can be used in client side to understand
 * what kind of error it is, without checking a dynamic message property.
 */
export class CodeError extends Error {
  "@type": "CodeError"
  code: string

  constructor(code: string, message: string) {
    super(message)
    this["@type"] = "CodeError"
    this.code = code
    Object.setPrototypeOf(this, CodeError.prototype)
  }
}

/**
 * HttpError is used to throw an error with a custom HTTP status code.
 * For example, throw new HttpError(404, "User not found")
 * sets 404 HTTP status code in a response.
 */
export class HttpError extends Error {
  "@type": "HttpError"
  httpCode: number
  code?: string

  constructor(httpCode: number, code: string, message: string)
  constructor(httpCode: number, message: string)
  constructor(httpCode: number, codeOrMessage: string, maybeMessage?: string) {
    const message = arguments.length === 3 ? maybeMessage : codeOrMessage
    const code = arguments.length === 3 ? codeOrMessage : undefined
    super(message)
    this["@type"] = "HttpError"
    this.httpCode = httpCode
    if (code) this.code = code
    Object.setPrototypeOf(this, HttpError.prototype)
  }
}
