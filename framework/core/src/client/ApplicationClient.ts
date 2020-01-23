import {Action} from "../app";
import {GraphQLVariables} from "../manager/GraphQLManager";

export type ApplicationClient = {
  graphql(data: string): Promise<any>
  // graphqlSelect(selectionName: string, ): Promise<any>
  action(route: string, type: string, values: Action | unknown): Promise<any>
  init(): Promise<void>
  graphqlFetch(query: string | { loc?: { source: { body: string }}}, variables?: GraphQLVariables): Promise<any>
}
