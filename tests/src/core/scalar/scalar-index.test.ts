import { DateTime, Float, Time } from "@microframework/core"

describe("core > scalar", () => {
  test("all scalars must properly work", () => {
    type Currency = {
      id: number
      name: string
      value: Float
      createdDate: Date
      createdDateTime: DateTime
      createdTime: Time
    }

    const usd: Currency = {
      id: 1,
      name: "usd",
      value: 1.5,
      createdDate: new Date(),
      createdDateTime: new Date(),
      createdTime: new Date(),
    }

    const brokenCurrency: Currency = {
      id: 1,
      name: "usd",
      // @ts-expect-error
      value: "1.5",
      createdDate: new Date(),
      createdDateTime: new Date(),
      createdTime: new Date(),
    }
  })
})
