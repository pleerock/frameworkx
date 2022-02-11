import {
  AnyApplication,
  ApplicationLogger,
  ApplicationTypeMetadata,
} from "@microframework/core"
import { Express } from "express"
import { Server as HttpServer } from "http"
import { DataSource } from "typeorm"
import { Server as WebsocketServer } from "ws"
import { ApplicationServerProperties } from "./application-server-properties-type"

/**
 * Application server.
 */
export interface ApplicationServer<App extends AnyApplication> {
  /**
   * Special identifier, indicates type of the object.
   */
  readonly "@type": "ApplicationServer"

  /**
   * Express instance, which is used for a webserver creation.
   */
  readonly express: Express

  /**
   * Application properties.
   */
  readonly properties: ApplicationServerProperties

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
   * Database source (TypeORM's connection).
   */
  readonly dataSource?: DataSource

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
