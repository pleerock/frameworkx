import {Action, ActionType, ApplicationProperties, ContextList} from "../app";
import {ActionMetadata, ApplicationMetadata} from "../metadata";
import {ActionResolverFn, executeAction, Resolver} from "../types";

/**
 * Action manager provides functionality over defined action routes.
 */
export class ActionManager<
  A extends Action,
  Context extends ContextList
  > {

  /**
   * Action type.
   */
  readonly _action!: A

  /**
   * Application's properties.
   */
  readonly appProperties: ApplicationProperties

  /**
   * Application's metadata.
   */
  readonly appMetadata: ApplicationMetadata

  /**
   * Action name.
   */
  readonly name: string

  /**
   * Action type (HTTP method).
   */
  readonly type: string

  /**
   * Action route.
   */
  readonly route: string


  constructor(
    appProperties: ApplicationProperties,
    appMetadata: ApplicationMetadata,
    name: string,
  ) {
    this.appProperties = appProperties
    this.appMetadata = appMetadata
    this.name = name
    this.type = name.substr(0, name.indexOf(" ")).toLowerCase()// todo: make sure to validate this before
    this.route = name.substr(name.indexOf(" ") + 1).toLowerCase()
  }

  /**
   * Defines a resolver for the current declaration.
   */
  resolve(resolver: ActionResolverFn<A, Context>): Resolver {
    return new Resolver({
      type: "action",
      name: this.name,
      resolverFn: resolver as any
    })
  }

  /**
   * Fetches the selected data.
   *
   * todo: instead of undefined make param optional (remove class!)
   */
  async fetch(values: ActionType<A> extends never ? undefined : ActionType<A>): Promise<A["return"]> {
    return executeAction(this.appProperties.client, this.route, this.type, values)
  }

  /**
   * Fetches the selected data and subscribes to the data changes,
   * every time when data set is changed on the server, new results will be emitted.
   */
  subscribe(fn: (data: A["return"]) => any) {
  }

  get metadata(): ActionMetadata {
    const actionMetadata = this.appMetadata.actions.find(action => action.name === this.name)
    if (!actionMetadata) {
      throw new Error(`No action ${this.name} was found registered in the application options`)
    }
    return actionMetadata
  }

}
