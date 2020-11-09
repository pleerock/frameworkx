import { parse } from "@microframework/parser"

describe("parse queries and mutations > intersection query type app", () => {
  test("query type defined as intersection type", () => {
    const result = parse(__dirname + "/intersection-query-type-app.ts")
    console.log(JSON.stringify(result, undefined, 2))
  })
})
