import { Fetcher } from "./index"
import {
  AnyRequestMapItem,
  Request,
  RequestMapItem,
} from "@microframework/core"

/**
 * Creates a new universal FetcherQueryBuilder.
 */
export function createFetcherQueryBuilder(
  fetcher: Fetcher,
  request: Request<any>,
  builderItem?: AnyRequestMapItem,
) {
  return {
    add(name: string) {
      return createFetcherMethodsProxy(fetcher, request, name)
    },
    select(selection: any) {
      if (!builderItem) {
        throw new Error(`Add a request item before selection.`)
      }
      ;(builderItem.options as any).select = selection
      return createFetcherQueryBuilder(fetcher, request)
    },
    response() {
      const itemsCount = Object.keys(request.map)
      if (!itemsCount)
        throw new Error(`You must build a complete query, before fetching it.`)

      return fetcher.response(request)
    },
    fetch() {
      const itemsCount = Object.keys(request.map)
      if (!itemsCount)
        throw new Error(`You must build a complete query, before fetching it.`)

      return fetcher.fetch(request)
    },
    fetchUnsafe() {
      const itemsCount = Object.keys(request.map)
      if (!itemsCount)
        throw new Error(`You must build a complete query, before fetching it.`)

      return fetcher.fetchUnsafe(request)
    },
    observe() {
      const itemsCount = Object.keys(request.map)
      if (!itemsCount) {
        throw new Error(
          `You must build a complete query, before observing to it.`,
        )
      }
      return fetcher.observe(request)
    },
  }
}

/**
 * Creates a proxy object that intercepts all fetcher method calls.
 */
export function createFetcherMethodsProxy(
  fetcher: Fetcher,
  request: Request<any>,
  itemName: string,
) {
  return new Proxy(
    {},
    {
      get(target, propKey, receiver) {
        return (...args: any[]) => {
          if (typeof propKey !== "string") {
            throw new Error(`Bad builder method call.`)
          }
          if (
            request.type !== "query" &&
            request.type !== "mutation" &&
            request.type !== "subscription"
          ) {
            throw new Error(`Invalid request type is given.`)
          }

          const item: RequestMapItem<any, any, any> = {
            "@type": "RequestMapItem",
            name: propKey,
            type: request.type,
            options: {
              input: args[0],
            },
            _selection: undefined,
            _model: undefined,
          }
          request.map[itemName] = item
          return createFetcherQueryBuilder(fetcher, request, item)
        }
      },
    },
  ) as any
}
