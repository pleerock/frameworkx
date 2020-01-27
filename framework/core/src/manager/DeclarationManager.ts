import {AnyApplicationOptions, ApplicationProperties, DeclarationItem, SelectionList} from "../app";
import {
  DeclarationArgs,
  DeclarationResolverFn,
  DeclarationSelectionArgs,
  DeclarationSelectionResult,
  executeQuery, ModelSelections,
  Resolver
} from "../types";

// export function declaration(name: string, resolver: () => ) {
//
// }
//
// declaration<CategoryDeclaration>("category", args => {
//
// })

/**
 * Declarations (root queries and mutations) manager -
 * allows to define a resolver for them or select data from the client.
 */
export class DeclarationManager<
  AppOptions extends AnyApplicationOptions,
  Declaration extends DeclarationItem,
  > {

  /**
   * Application's properties.
   */
  readonly appProperties: ApplicationProperties

  /**
   * Indicates if this declaration is a query or a mutation.
   */
  readonly type: "query" | "mutation"

  /**
   * Query / mutation name.
   */
  readonly name: string

  constructor(
    appProperties: ApplicationProperties,
    type: "query" | "mutation",
    name: string,
  ) {
    this.appProperties = appProperties
    this.type = type
    this.name = name
  }

  select<SelectionName extends keyof ModelSelections<Declaration, AppOptions["selections"]>>(
      selection: SelectionName,
      declarationArgs: DeclarationArgs<Declaration>,
      selectionArgs: DeclarationSelectionArgs<Declaration>,
  ): Promise<DeclarationSelectionResult<Declaration, AppOptions["selections"][SelectionName]["schema"]>> {
    return executeQuery(this.appProperties.client, this.type, this.name as string, selection as string, declarationArgs)
  }

  // todo: make args depend on declaration
  fetch<SelectionName extends keyof AppOptions["selections"]>(
      selection: SelectionName,
      declarationArgs: DeclarationArgs<Declaration>,
      selectionArgs: DeclarationSelectionArgs<Declaration>,
  ): Promise<DeclarationSelectionResult<Declaration, AppOptions["selections"][SelectionName]["schema"]>> {
    return executeQuery(this.appProperties.client, this.type, this.name as string, selection as string, declarationArgs)
  }

  /**
   * Creates a declaration selector that allows to select a data from the declaration on the remote.
  select<Selection extends DeclarationSelection<Declaration>>(
    selection: Selection
  ): DeclarationSelector<Declaration, Selection> {
    return new DeclarationSelector(
      this.appProperties,
      this.type,
      this.name,
      selection,
    )
  }*/

  /**
   * Defines a resolver for the current declaration.
   */
  resolve(resolver: DeclarationResolverFn<Declaration, AppOptions["context"]>): Resolver {
    return new Resolver({
      type: this.type,
      name: this.name,
      resolverFn: resolver as any
    })
  }

}
