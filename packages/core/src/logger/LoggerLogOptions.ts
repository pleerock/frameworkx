import { LogEvent } from "./LogEvent"

/**
 * Options provided to the logger interface methods call.
 */
export type LoggerLogOptions = {

    /**
     * Logger name.
     */
    name: string

    /**
     * Logging level.
     */
    level:
        | "verbose"
        | "info"
        | "warning"
        | "error"

    /**
     * Operation type.
     */
    type:
        | "query"
        | "mutation"
        | "subscription"
        | "model"
        | "action"
        | "any"

    /**
     * Logging message.
     */
    message: string

    /**
     * Additional information that can be used in logging.
     */
    event?: LogEvent
}
