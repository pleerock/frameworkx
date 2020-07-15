const actual = jest.requireActual<any>("ws")
export = jest.mock("ws", () => ({
  ...actual,
  Server: jest.fn().mockImplementation((...args: any[]) => {
    return new actual.Server(...args)
  }),
}))
