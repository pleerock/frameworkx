import { Application, createApp } from "@microframework/core"

describe("core > application > functions", () => {
  describe("createApp", () => {
    test("should return Application instance", () => {
      expect(createApp()).toBeInstanceOf(Application)
    })
  })
})
