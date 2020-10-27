import { Hub, HubAppList } from "./hub-types"
import { HubErrors } from "./hub-errors"

/**
 * Creates applications hub.
 */
export function createHub<Apps extends HubAppList>(apps: Apps): Hub<Apps> {
  return {
    "@type": "Hub",
    apps: apps,
    app(name) {
      if (!apps[name]) throw HubErrors.unknownApp(name as string)
      return apps[name]
    },
  }
}
