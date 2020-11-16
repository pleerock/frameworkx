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

  test("query model is not defined in 'models'", () => {
    expect(() =>
      parse(__dirname + "/missing-models-in-queries-app.ts"),
    ).toThrowError(
      `Types [PostType] must be defined in "models" section in order to use queries.`,
    )
  })

  test("mutation model is not defined in 'models'", () => {
    expect(() =>
      parse(__dirname + "/missing-models-in-mutations-app.ts"),
    ).toThrowError(
      `Types [PostType] must be defined in "models" section in order to use mutations.`,
    )
  })

  test("subscription model is not defined in 'models'", () => {
    expect(() =>
      parse(__dirname + "/missing-models-in-subscriptions-app.ts"),
    ).toThrowError(
      `Types [PostType] must be defined in "models" section in order to use subscriptions.`,
    )
  })

  test.skip("action model is not defined in 'models'", () => {
    expect(() =>
      parse(__dirname + "/missing-models-in-actions-app.ts"),
    ).toThrowError(
      `Types [PostType] must be defined in "models" section in order to use actions.`,
    )
  })

  test.skip("query input is not defined in 'inputs'", () => {
    expect(() =>
      parse(__dirname + "/missing-inputs-in-queries-app.ts"),
    ).toThrowError(
      `Types [PostInput] must be defined in "inputs" section in order to use queries.`,
    )
  })

  test.skip("mutation input is not defined in 'inputs'", () => {
    expect(() =>
      parse(__dirname + "/missing-inputs-in-mutations-app.ts"),
    ).toThrowError(
      `Types [PostInput] must be defined in "inputs" section in order to use mutations.`,
    )
  })

  test.skip("subscription input is not defined in 'inputs'", () => {
    expect(() =>
      parse(__dirname + "/missing-inputs-in-subscriptions-app.ts"),
    ).toThrowError(
      `Types [PostInput] must be defined in "inputs" section in order to use subscriptions.`,
    )
  })
})
