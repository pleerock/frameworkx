import {
  ApplicationLogger,
  ContextLogger,
  LogEvent,
  Logger,
  ResolverType,
} from "@microframework/core"

/**
 * Creates a context logger.
 */
export function createContextLogger(
  logger: Logger,
  type: ResolverType,
  event: LogEvent,
): ContextLogger {
  return {
    log: (message) => {
      const level = "verbose"
      return logger({ type, level, name: "", message, event })
    },
    info: (message) => {
      const level = "info"
      return logger({ type, level, name: "", message, event })
    },
    warning: (message) => {
      const level = "warning"
      return logger({ type, level, name: "", message, event })
    },
    error: (message) => {
      const level = "error"
      return logger({ type, level, name: "", message, event })
    },
  }
}

/**
 * Creates an application logger.
 */
export function createApplicationLogger(logger: Logger): ApplicationLogger {
  return {
    log: (...args: string[]) => {
      const level = "verbose"
      const name = args.length === 2 ? args[0] : ""
      const message = args.length === 2 ? args[1] : args[0]
      return logger({ type: "any", level, name, message })
    },
    info: (...args: string[]) => {
      const level = "info"
      const name = args.length === 2 ? args[0] : ""
      const message = args.length === 2 ? args[1] : args[0]
      return logger({ type: "any", level, name, message })
    },
    warning: (...args: string[]) => {
      const level = "warning"
      const name = args.length === 2 ? args[0] : ""
      const message = args.length === 2 ? args[1] : args[0]
      return logger({ type: "any", level, name, message })
    },
    error: (...args: string[]) => {
      const level = "error"
      const name = args.length === 2 ? args[0] : ""
      const message = args.length === 2 ? args[1] : args[0]
      return logger({ type: "any", level, name, message })
    },
  }
}
