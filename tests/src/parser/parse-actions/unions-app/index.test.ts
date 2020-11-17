import { parse } from "@microframework/parser"

describe("parser > parse actions", () => {
  test("actions defined with a unions", () => {
    const appMetadata = parse(__dirname + "/unions-app.ts")
  })
})
