import { GatewayApp } from "../app"

/**
 * Resolver for a User model.
 */
export const UserModelResolver = GatewayApp.resolver(GatewayApp.model("User"), {
  // ... resolve user model properties ...
})
