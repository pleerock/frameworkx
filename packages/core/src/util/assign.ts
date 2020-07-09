/**
 * Type-safe version of Object.assign function.
 */
export function assign<T extends Object>(
  obj: T,
  ...partials: Partial<T>[]
): void {
  for (let partial of partials) {
    Object.assign(obj, partial)
  }
}
