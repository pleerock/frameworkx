/**
 * Logger interface.
 */
export type Logger = {

    /**
     * Logs a message.
     */
    log(name: string, message: string): void

    /**
     * Logs an error message.
     */
    error(name: string, message: string): void

}
