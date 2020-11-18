import { parse } from "@microframework/parser"

describe("parse queries > wrong definition", () => {
  test("duplicated queries", () => {
    expect(() => parse(__dirname + "/duplicated-queries-app.ts")).toThrowError(
      `"queries" inside application options contains duplicated properties [post]`,
    )
  })

  test("duplicated mutations", () => {
    expect(() =>
      parse(__dirname + "/duplicated-mutations-app.ts"),
    ).toThrowError(
      `"mutations" inside application options contains duplicated properties [postSave]`,
    )
  })

  test("duplicated subscriptions", () => {
    expect(() =>
      parse(__dirname + "/duplicated-subscriptions-app.ts"),
    ).toThrowError(
      `"subscriptions" inside application options contains duplicated properties [postCreated]`,
    )
  })
})
