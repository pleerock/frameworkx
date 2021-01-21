import { parse } from "@microframework/parser"

describe("parse arrays > array app", () => {
  test("model defined with arrays", () => {
    const result = parse(__dirname + "/array-app.ts")
    console.log(JSON.stringify(result, undefined, 2))
  })
})
