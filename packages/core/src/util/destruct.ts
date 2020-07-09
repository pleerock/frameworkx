/**
 * Allows to perform object destruction safely,
 * with binding to its original context object.
 *
 * @experimental
 */
export function destruct<T extends Object>(obj: T): T {
  const literal: any = {}
  Object.getOwnPropertyNames(obj).forEach((key) => {
    const value = (obj as any)[key]
    if (value instanceof Function) {
      literal[key] = value.bind(obj)
    } else {
      literal[key] = value
    }
  })
  if (obj.constructor.prototype !== Object.prototype) {
    Object.getOwnPropertyNames(obj.constructor.prototype).forEach((key) => {
      if (key !== "constructor") {
        const value = (obj as any)[key]
        if (value instanceof Function) {
          literal[key] = value.bind(obj)
        } else {
          literal[key] = value
        }
      }
    })
  }
  return literal
}
