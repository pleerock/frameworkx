/**
 * Rate limitation for single query / mutation / model / action.
 * Although it doesn't tight to a particular package, by default its recommended to use
 * https://github.com/animir/node-rate-limiter-flexible package and this interface has all
 * options from this particular package.
 */
export type RateLimitItemOptions = {
  keyPrefix?: string
  points?: number
  duration?: number
  execEvenly?: boolean
  execEvenlyMinDelayMs?: number
  blockDuration?: number
  storeClient?: any
  storeType?: string
  inmemoryBlockOnConsumed?: number
  inmemoryBlockDuration?: number
  insuranceLimiter?: any
  dbName?: string
  tableName?: string
} & { [key: string]: any }
