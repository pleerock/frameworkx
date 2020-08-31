jest.mock("ws", () => {
  const actual = jest.requireActual("ws")
  return {
    ...actual,
    Server: jest.fn().mockImplementation((...args: any[]) => {
      return new actual.Server(...args)
    }),
  }
})
