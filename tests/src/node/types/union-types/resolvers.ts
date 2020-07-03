import { resolver } from "@microframework/core"
import { App } from "./app"
import { OrganizationType, UserType } from "./models"

export const PostResolver = resolver(App, "post", ({ id }) => {
  if (id === 1) {
    return {
      id,
      title: "User's post",
      author: {
        __typename: "UserType",
        id: "1",
        firstName: "Timber",
        lastName: "Saw",
      } as UserType,
    }
  } else {
    return {
      id,
      title: "Organization's post",
      author: {
        __typename: "OrganizationType",
        id: "1",
        name: "AwesomeCorp",
      } as OrganizationType,
    }
  }
})
