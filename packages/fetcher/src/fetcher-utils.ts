import {
  AllRequestActionOptions,
  AnyRequestAction,
  Request,
} from "@microframework/core"
import { compile } from "path-to-regexp"
import { FetcherOptions } from "./fetcher-options-type"
import { FetcherErrors } from "./fetcher-errors"

/**
 * Set of utility functions used in the fetcher package.
 */
export const FetcherUtils = {
  /**
   * Checks if given value is a RequestAction.
   */
  isRequestAnAction(request: any): request is Request<any> {
    return (
      typeof request === "object" &&
      request.map &&
      request.map["@type"] === "RequestAction"
    )
  },
  /**
   * Builds a headers for a fetcher request.
   */
  async buildHeaders(
    options: FetcherOptions,
    action?: AnyRequestAction,
  ): Promise<{ [key: string]: string }> {
    const headers: { [key: string]: any } = {
      "Content-type": "application/json",
    }
    if (
      action &&
      action.options &&
      (action.options as AllRequestActionOptions).headers
    ) {
      Object.assign(
        headers,
        (action.options as AllRequestActionOptions).headers,
      )
    }
    if (options.headersFactory) {
      const userHeaders = options.headersFactory()
      if (userHeaders["then"] !== undefined) {
        Object.assign(headers, await userHeaders)
      } else {
        Object.assign(headers, userHeaders)
      }
    }
    for (let key in headers) {
      if (headers[key] instanceof Date) {
        headers[key] = headers[key].toISOString()
      } else if (typeof headers[key] === "object") {
        headers[key] = JSON.stringify(headers[key])
      }
    }
    return headers
  },

  /**
   * Builds a body for a fetcher request.
   */
  buildBody(action: AnyRequestAction): string | undefined {
    let body: any = undefined
    if ((action.options as AllRequestActionOptions).body) {
      body = JSON.stringify((action.options as AllRequestActionOptions).body)
    }
    return body
  },

  /**
   * Builds a query string for a fetcher request.
   */
  buildQueryString(action: AnyRequestAction): string {
    const queryMap = (action.options as AllRequestActionOptions).query
    if (queryMap) {
      let query = "?"
      query += Object.keys(queryMap)
        .map((k) => {
          let value = queryMap[k]
          if (value instanceof Date) {
            value = value.toISOString()
          } else if (typeof value === "object") {
            value = JSON.stringify(value)
          }
          return encodeURIComponent(k) + "=" + encodeURIComponent(value)
        })
        .join("&")
      return query
    }
    return ""
  },

  /**
   * Builds a path (with or without params) for a fetcher request.
   */
  buildParamsPath(action: AnyRequestAction): string {
    let path: string = action.path
    const options = action.options as AllRequestActionOptions // []
    if (options && options.params) {
      const paramMap: { [key: string]: any } = {}
      for (let key in options.params) {
        let value = options.params[key]
        if (value instanceof Date) {
          value = value.toISOString()
        } else if (typeof value === "object") {
          value = JSON.stringify(value)
        } else if (typeof value === "boolean" || typeof value === "bigint") {
          value = value.toString()
        }
        paramMap[key] = value
      }

      const toPath = compile(path, {
        encode: encodeURIComponent,
      })
      path = toPath(paramMap)
    }

    return path
  },

  /**
   * Extracts a GraphQL query name and body out of a given request or gql object.
   */
  extractQueryMetadata(
    request: Request<any> | string | any,
  ): { name: string; body: string } {
    let queryName = ""
    let queryBody = ""
    if (typeof request === "string") {
      queryBody = request
    } else if (request["@type"] === "Request") {
      queryName = request.name
      queryBody = this.requestToQuery(request as Request<any>)
    } else if (
      (request as any)["definitions"] !== undefined ||
      (request as any)["loc"] !== undefined
    ) {
      // console.log(request)
      if ((request as any)["definitions"]) {
        queryName = (request as any)["definitions"]
          .filter((def: any) => !!(def as any)["name"])
          .map((def: any) => (def as any)["name"]["value"])
          .join(",")
      }
      if ((request as any)["loc"]) {
        queryBody = (request as any)["loc"].source.body
      }
    }
    return { name: queryName, body: queryBody }
  },

  /**
   * Converts a request into GraphQL query.
   */
  requestToQuery(request: Request<any>): string {
    const isQuery =
      request.type === "query" ||
      Object.keys(request.map).some((key) => request.map[key].type === "query")
    const isMutation =
      request.type === "mutation" ||
      Object.keys(request.map).some(
        (key) => request.map[key].type === "mutation",
      )
    const isSubscription =
      request.type === "subscription" ||
      Object.keys(request.map).some(
        (key) => request.map[key].type === "subscription",
      )
    const isMixed =
      [isQuery, isMutation, isSubscription].filter((bool) => bool === true)
        .length > 1
    if (isMixed) {
      throw FetcherErrors.mixedDeclarationTypesInQuery()
    }

    let query = ""
    if (isQuery) {
      query += `query `
    } else if (isMutation) {
      query += `mutation `
    } else if (isSubscription) {
      query += `subscription `
    }
    query += `${request.name} {\r\n`
    for (let key in request.map) {
      query += `  ${key}: ${request.map[key].name}`
      if (request.map[key].options.input) {
        query += `(\r\n${this.serializeInput(
          request.map[key].options.input,
          1,
        )}  )`
      }
      if (request.map[key].options.select) {
        query += " " + this.serializeSelect(request.map[key].options.select, 1)
      }
    }
    // query += " " + this.transform(options.select)
    query += "}\r\n"
    // console.log(query)
    return query
  },

  /**
   * Serializes a given input object into GraphQL's query input format.
   */
  serializeInput(input: any, nestingLevel: number) {
    let query = ""
    for (let key in input) {
      if (Array.isArray(input[key])) {
        query += `${"  ".repeat(nestingLevel + 1)}${key}: [${input[key]
          .map((item: any) => {
            let subQuery = ""
            if (item === null || item === undefined) {
              subQuery += "null"
            } else if (typeof item === "object") {
              subQuery += `{\r\n${this.serializeInput(
                item,
                nestingLevel + 1,
              )}${"  ".repeat(nestingLevel + 1)}}`
            } else {
              subQuery += JSON.stringify(item)
            }
            return subQuery
          })
          .join(", ")}]\r\n`
      } else if (input[key] === null || input[key] === undefined) {
        query += `${"  ".repeat(nestingLevel + 1)}${key}: null\r\n`
      } else if (typeof input[key] === "object") {
        query += `${"  ".repeat(
          nestingLevel + 1,
        )}${key}: {\r\n${this.serializeInput(
          input[key],
          nestingLevel + 1,
        )}${"  ".repeat(nestingLevel + 1)}}\r\n`
      } else {
        query += `${"  ".repeat(nestingLevel + 1)}${key}: ${JSON.stringify(
          input[key],
        )}\r\n`
      }
    }
    return query
  },

  /**
   * Serializes a given selection object into GraphQL's query selection format.
   */
  serializeSelect(select: any, nestingLevel: number) {
    let query = "{\r\n"
    for (let key in select) {
      if (select[key] === true) {
        query += `${"  ".repeat(nestingLevel + 1)}${key}\r\n`
      } else if (typeof select[key] === "object") {
        query += `${"  ".repeat(nestingLevel + 1)}${key} ${this.serializeSelect(
          select[key],
          nestingLevel + 1,
        )}`
      }
    }
    query += `${"  ".repeat(nestingLevel)}}\r\n`
    return query
  },
}
