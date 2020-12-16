/**
 * Special type of Error containing errors occurred during network request execution.
 */
export class FetcherError extends Error {
  "@type": "FetcherError"
  errors: any[]
  queryName?: string

  constructor(queryName: string | undefined, errors: any[]) {
    super(
      (queryName ? `GraphQL(${queryName}):` : `GraphQL`) +
        JSON.stringify(errors),
    )
    this["@type"] = "FetcherError"
    this.queryName = queryName
    this.errors = errors
    Object.setPrototypeOf(this, FetcherError.prototype)
  }
}
