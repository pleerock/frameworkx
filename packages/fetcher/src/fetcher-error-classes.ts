/**
 * Special type of Error use show errors occurred during network request execution.
 */
export class FetcherError extends Error {
  typeof: "FetcherError"
  errors: any[]
  queryName?: string

  constructor(queryName: string | undefined, errors: any[]) {
    super(
      (queryName ? `GraphQL(${queryName}):` : `GraphQL`) +
        JSON.stringify(errors),
    )
    this.typeof = "FetcherError"
    this.queryName = queryName
    this.errors = errors
    Object.setPrototypeOf(this, FetcherError.prototype)
  }
}
