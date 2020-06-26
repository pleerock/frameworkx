import { parse } from "@microframework/parser"

describe("parser > parse enums", () => {
  test("input defined as a type", () => {
    const result = parse(__dirname + "/app/app.ts")
    console.log(JSON.stringify(result, undefined, 2))
    // expect(result).toEqual({})
  })
})
