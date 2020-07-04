export type RateLimitNodeOptions = {
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
}
