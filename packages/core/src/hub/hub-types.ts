import { AnyApplication } from "../application"

/**
 * List of applications into the Hub.
 */
export type HubAppList = {
  [name: string]: AnyApplication
}

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

  /**
   * Returns an app by a given app name.
   */
  app<Name extends keyof Apps>(name: Name): Apps[Name]
}
