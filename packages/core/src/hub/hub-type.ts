import { HubAppList } from "./hub-list-type"

/**
 * Hub connects all the apps.
 */
export type Hub<Apps extends HubAppList> = {
  /**
   * Unique type identifier.
   */
  readonly "@type": "Hub"

  /**
   * Connected apps.
   */
  readonly apps: Apps
}
