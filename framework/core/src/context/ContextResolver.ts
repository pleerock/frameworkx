import {ContextList} from "../app";

/**
 * Type for context resolver.
 *
 * todo: add request/response parameters
 */
export type ContextResolver<Context extends ContextList> = {
  [P in keyof Context]: (options: { request: any }) => Context[P] | Promise<Context[P]>
}
