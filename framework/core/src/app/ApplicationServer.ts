/**
 * Type for the server implementation for application.
 */
export type ApplicationServer = () => Promise<() => Promise<void>>
