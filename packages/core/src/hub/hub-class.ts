import { HubAppList } from "./hub-core-types"

/**
 * Hub connects all the apps.
 */
export class Hub<Apps extends HubAppList> {
  /**
   * Unique type identifier.
   */
  readonly "@type": "Hub" = "Hub"

  /**
   * Connected apps.
   */
  readonly apps: Apps

  constructor(apps: Apps) {
    this.apps = apps
  }
}
