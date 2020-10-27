/**
 * Context logger.
 */
export type ContextLogger = {
  /**
   * Logs a verbose message.
   */
  log(message: string | any): void

  /**
   * Logs an informative message.
   */
  info(message: string | any): void

  /**
   * Logs a warning message.
   */
  warning(message: string | any): void

  /**
   * Logs an error message.
   */
  error(message: string | any): void
}
