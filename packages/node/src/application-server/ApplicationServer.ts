import { AnyApplication, ApplicationLogger } from "@microframework/core"
import { ApplicationTypeMetadata } from "@microframework/core/_"
import { Express } from "express"
import { Server as HttpServer } from "http"
import { Server as WebsocketServer } from "ws"

/**
 * Application server.
 */
export interface ApplicationServer<App extends AnyApplication> {
  /**
   * Special identifier, indicates type of the object.
   */
  readonly typeof: "ApplicationServer"

  /**
   * Express instance, which is used
   */
  readonly express: Express

  /**
   * Logger can be used to log application-level events.
   */
  readonly logger: ApplicationLogger

  /**
   * Parsed application type metadata.
   */
  readonly metadata: ApplicationTypeMetadata

  /**
   * Http server created on application start.
   * Defined only when http server is launched via #start method.
   */
  readonly server?: HttpServer

  /**
   * Websocket server created on application start.
   * Defined only when websocket server is launched via #start method.
   */
  readonly websocketServer?: WebsocketServer

  /**
   * Starts application server.
   * Runs express server, websocket server, setups database connection, etc.
   */
  start(): Promise<this>

  /**
   * Completely stops the application server.
   */
  stop(): Promise<this>
}
