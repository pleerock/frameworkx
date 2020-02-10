/**
 * Provides a syntax sugar for those who want to create a service or singleton using class syntax.
 *
 * @experimental still, its recommended to use literal object syntax, e.g. export const Service = { ... }.
 */
export function service<T>(cls: { new(...args: any[]): T }) {
    return new cls()
}
