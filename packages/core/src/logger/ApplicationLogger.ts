
/**
 * Application-level logger.
 */
export type ApplicationLogger = {

    /**
     * Logs a verbose message.
     */
    log(message: string | null): void

    /**
     * Logs a verbose message.
     */
    log(name: string, message: string | null): void

    /**
     * Logs an informative message.
     */
    info(message: string | null): void

    /**
     * Logs an informative message.
     */
    info(name: string, message: string | null): void

    /**
     * Logs a warning message.
     */
    warning(message: string | null): void

    /**
     * Logs a warning message.
     */
    warning(name: string, message: string | null): void

    /**
     * Logs an error message.
     */
    error(message: string | null): void

    /**
     * Logs an error message.
     */
    error(name: string, message: string | null): void

}
