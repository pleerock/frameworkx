import { CarFactory } from "./services"

describe("core > service > basic usage", () => {
  test("basic usage", () => {
    expect(CarFactory.build()).toEqual([
      { id: 1, name: "Model X" },
      { id: 2, name: "Model Y" },
      { id: 3, name: "Model Z" },
    ])
  })
})
