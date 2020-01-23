import {ApplicationProperties, ContextList, Model} from "../app";
import {DeclarationSelection, executeQuery} from "../types";

/**
 * Operates over selected peace of data.
 */
export class ModelSelector<
  M extends Model<any, any>,
  Context extends ContextList,
  Selection extends DeclarationSelection<M, true>,
  ReturnedType extends unknown
  > {

  readonly properties: ApplicationProperties
  readonly name: string
  readonly selection: Selection

  constructor(
    properties: ApplicationProperties,
    name: string,
    selection: Selection,
  ) {
    this.properties = properties
    this.name = name
    this.selection = selection
  }

  /**
   * Fetches the selected data.
   */
  fetch(): Promise<ReturnedType> {
    return executeQuery(this.properties.client, "query", this.name as string, this.selection as any, 0 as any)
  }

  /**
   * Fetches the selected data and subscribes to the data changes,
   * every time when data set is changed on the server, new results will be emitted.
   */
  subscribe(fn: (data: ReturnedType) => any) {
  }

}
