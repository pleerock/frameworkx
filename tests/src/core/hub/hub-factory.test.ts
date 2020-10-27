import { createApp, createHub } from "@microframework/core"

describe("core > hub > factory", () => {
  describe("createHub", () => {
    test("must return a Hub type", () => {
      const hub = createHub({})
      expect(hub["@type"]).toBe("Hub")
      expect(hub.apps).toBeDefined()
    })
    test("all apps must be accessible", () => {
      const postApp = createApp()
      const userApp = createApp()
      const photoApp = createApp()
      const hub = createHub({
        post: postApp,
        user: userApp,
        photo: photoApp,
      })
      expect(hub.apps).toEqual({
        post: postApp,
        user: userApp,
        photo: photoApp,
      })
    })
    test("single app must be accessible", () => {
      const postApp = createApp()
      const userApp = createApp()
      const photoApp = createApp()
      const hub = createHub({
        post: postApp,
        user: userApp,
        photo: photoApp,
      })
      expect(hub.app("post")).toEqual(postApp)
      expect(hub.app("user")).toEqual(userApp)
      expect(hub.app("photo")).toEqual(photoApp)
      // @ts-expect-error
      expect(() => hub.app("gallery")).toThrowError(
        `"gallery" isn't registered in the Hub.`,
      )
    })
  })
})
