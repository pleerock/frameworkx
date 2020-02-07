import { AppResolverType, ListOfType } from "@microframework/core";
import { defaultServer } from "@microframework/node";
import { App } from "./app";

export const AppServer = (port: number, resolvers: ListOfType<AppResolverType>) => defaultServer(App, {
    appPath: __dirname + "/app",
    port: port,
    cors: true,
    graphiql: true,
    playground: true,
    resolvers
})
