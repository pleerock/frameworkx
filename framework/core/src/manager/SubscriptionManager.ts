import {ApplicationProperties, ContextList, DeclarationItem} from "../app";
import {SubscriptionSelector} from "../selection/SubscriptionSelector";
import {DeclarationSelection, Resolver, SubscriptionResolverFn} from "../types";

/**
 * Subscriptions manager.
 */
export class SubscriptionManager<
  Declaration extends DeclarationItem,
  Context extends ContextList
  > {

  /**
   * Application's properties.
   */
  readonly appProperties: ApplicationProperties

  /**
   * Subscription name.
   */
  readonly name: string

  constructor(
    appProperties: ApplicationProperties,
    name: string,
  ) {
    this.appProperties = appProperties
    this.name = name
  }

  /**
   * Returns observer to subscribe to the changes.
   */
  select<Selection extends DeclarationSelection<Declaration>>(
    selection: Selection
  ): SubscriptionSelector<Declaration, Selection> {
    return new SubscriptionSelector(
      this.appProperties,
      this.name,
      selection,
    )
  }

  /**
   * Defines a resolver for the current subscription.
   */
  resolve(resolver: SubscriptionResolverFn<Declaration, Context>): Resolver {
    return new Resolver({
      type: "subscription",
      name: this.name,
      resolverFn: resolver
    })
  }

}
