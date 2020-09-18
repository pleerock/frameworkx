import { Fetcher } from "./index"
import { Request, RequestMapItem, RequestQuery } from "@microframework/core"

export function FetcherBuilderExecutor(
  fetcher: Fetcher,
  request: Request<any>,
  builderItem?: RequestMapItem,
) {
  return {
    select(selection: any) {
      if (!builderItem) {
        throw new Error(`Add a request item before selection.`)
      }
      ;(builderItem.options as any).select = selection
      return FetcherBuilderExecutor(fetcher, request)
    },
    add(name: string) {
      return FetcherBuilderProxy(fetcher, request, name)
    },
    observe() {
      const itemsCount = Object.keys(request.map)
      if (!itemsCount) {
        throw new Error(
          `You must build a complete query, before observing to it.`,
        )
      }

      Object.keys(request.map).forEach((key) => {
        request.map[key].type = "subscription"
      })
      // console.log(request)
      return fetcher.observe(request)
    },
    fetch() {
      const itemsCount = Object.keys(request.map)
      if (!itemsCount)
        throw new Error(`You must build a complete query, before fetching it.`)

      return fetcher.fetch(request)
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
          if (typeof propKey !== "string")
            throw new Error(`Bad builder method call.`)

          const item: RequestQuery<any, any, any, any> = {
            name: propKey,
            selection: undefined,
            model: undefined,
            type: request.type as any,
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
