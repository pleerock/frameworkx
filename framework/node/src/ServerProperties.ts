import { AppResolverType, ListOfType } from "@microframework/core";
import { CorsOptions } from "cors";
import { PubSub } from "graphql-subscriptions";
import { Connection, ConnectionOptions } from "typeorm";
import { ErrorHandler } from "./error-handler";
import { NamingStrategy } from "./naming-strategy/NamingStrategy";

export type ServerProperties = {

    /**
     * App file path.
     */
    appPath: string

    /**
     * Custom express server instance.
     * You can create and configure your own instance of express and framework will use it.
     * If not passed, default express server will be used.
     */
    express?: any

    /**
     * Port on which to run express server.
     */
    port: number

    /**
     * Port on which to run websocket server.
     */
    websocketPort?: number

    /**
     * Route on which to register a graphql requests.
     * If not set, default is "/graphql".
     */
    route?: string

    /**
     * Route on which to register a subscriptions websocket interface.
     * If not set, default is "/subscriptions".
     */
    subscriptionsRoute?: string

    /**
     * Should be set to true to enable cors.
     */
    cors?: boolean | CorsOptions

    /**
     * Indicates if graphiQL should be enabled or not.
     */
    graphiql?: boolean

    /**
     * Indicates if playground should be enabled or not.
     */
    playground?: boolean

    /**
     * PubSub to be used for subscriptions.
     */
    pubSub?: PubSub

    /**
     * ORM data source (connection) used in the application.
     */
    dataSource?: Connection

    /**
     * Callback that creates ORM data source.
     */
    dataSourceFactory?: (options: Partial<ConnectionOptions>) => Promise<Connection>

    /**
     * Strategy for naming special identifiers used in the framework.
     */
    namingStrategy?: NamingStrategy

    /**
     * Handling errors logic.
     */
    errorHandler?: ErrorHandler

    /**
     * List of registered resolvers.
     */
    resolvers: ListOfType<AppResolverType>

    /**
     * List of registered action middlewares.
     */
    actionMiddlewares?: { [key: string]: () => any[] }

    /**
     * Indicates if framework should automatically generate root queries and mutations for your models.
     */
    generateModelRootQueries?: boolean

    /**
     * Maximal deepness for nested conditions of automatically generated queries.
     */
    maxGeneratedConditionsDeepness?: number

}