import { AnyApplicationOptions } from "./application-options";

/**
 * Application is a root point of the framework.
 */
export class Application<Options extends AnyApplicationOptions> {

  /**
   * Unique identifier.
   */
  readonly instanceof: "Application" = "Application"

  /**
   * Application options.
   */
  readonly _options!: Options

}
