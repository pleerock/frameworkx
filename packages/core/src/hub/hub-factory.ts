import { HubAppList } from "./hub-list-type"
import { Hub } from "./hub-type"

/**
 * Creates applications hub.
 */
export function createHub<Apps extends HubAppList>(apps: Apps): Hub<Apps> {
  return {
    "@type": "Hub",
    apps: apps,
  }
}
