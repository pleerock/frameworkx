import { HubAppList } from "./hub-core-types"
import { Hub } from "./hub-class"

/**
 * Creates applications hub.
 */
export function createHub<Apps extends HubAppList>(apps: Apps) {
  return new Hub(apps)
}
