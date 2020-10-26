import { Request } from "@microframework/core"

export function extractQueryMetadata(request: Request<any> | string | any) {
  let queryName = ""
  let queryString = ""
  if (typeof request === "string") {
    queryString = request
  } else if (request["@type"] === "Request") {
    queryName = request.name
    queryString = requestToQuery(request as Request<any>)
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
      queryString = (request as any)["loc"].source.body
    }
  }
  return { queryName, queryString }
}

function serializeInput(input: any, nestingLevel: number) {
  let query = ""
  for (let key in input) {
    if (Array.isArray(input[key])) {
      query += `${"  ".repeat(nestingLevel + 1)}${key}: [${input[key]
        .map((item: any) => {
          let subQuery = ""
          if (item === null || item === undefined) {
            subQuery += "null"
          } else if (typeof item === "object") {
            subQuery += `{\r\n${serializeInput(
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
      query += `${"  ".repeat(nestingLevel + 1)}${key}: {\r\n${serializeInput(
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
}

function serializeSelect(select: any, nestingLevel: number) {
  let query = "{\r\n"
  for (let key in select) {
    if (select[key] === true) {
      query += `${"  ".repeat(nestingLevel + 1)}${key}\r\n`
    } else if (typeof select[key] === "object") {
      query += `${"  ".repeat(nestingLevel + 1)}${key} ${serializeSelect(
        select[key],
        nestingLevel + 1,
      )}`
    }
  }
  query += `${"  ".repeat(nestingLevel)}}\r\n`
  return query
}

export function requestToQuery(request: Request<any>): string {
  const isQuery =
    request.type === "query" ||
    Object.keys(request.map).some((key) => request.map[key].type === "query")
  const isMutation =
    request.type === "mutation" ||
    Object.keys(request.map).some((key) => request.map[key].type === "mutation")
  const isSubscription =
    request.type === "subscription" ||
    Object.keys(request.map).some(
      (key) => request.map[key].type === "subscription",
    )
  const isMixed =
    [isQuery, isMutation, isSubscription].filter((bool) => bool === true)
      .length > 1
  if (isMixed)
    throw new Error(
      `A single request can't mix queries, mutations and subscriptions.`,
    )

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
      query += `(\r\n${serializeInput(request.map[key].options.input, 1)}  )`
    }
    if (request.map[key].options.select) {
      query += " " + serializeSelect(request.map[key].options.select, 1)
    }
  }
  // query += " " + this.transform(options.select)
  query += "}\r\n"
  // console.log(query)
  return query
}
