import { AnyApplicationOptions } from "./application-options";

/**
 * Application is a root point of the framework.
 */
export class Application<Options extends AnyApplicationOptions> {

  /**
   * Application options.
   */
  readonly _options!: Options

}
