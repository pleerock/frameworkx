import { Fetcher } from "./index"
import { Request, RequestMapItem } from "@microframework/core"

export function FetcherBuilderExecutor(
  fetcher: Fetcher,
  request: Request<any>,
  builderItem?: RequestMapItem<any, any, any>,
) {
  return {
    add(name: string) {
      return FetcherBuilderProxy(fetcher, request, name)
    },
    select(selection: any) {
      if (!builderItem) {
        throw new Error(`Add a request item before selection.`)
      }
      ;(builderItem.options as any).select = selection
      return FetcherBuilderExecutor(fetcher, request)
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

export function FetcherBuilderProxy(
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
            name: propKey,
            selection: undefined,
            model: undefined,
            type: request.type,
            options: {
              input: args[0],
            },
          }
          request.map[itemName] = item
          return FetcherBuilderExecutor(fetcher, request, item)
        }
      },
    },
  ) as any
}
