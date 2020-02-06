import { defaultServer } from "@microframework/node";
import { App } from "./app";

export const AppServer = (port: number) => defaultServer(App, {
    appPath: __dirname + "/app",
    port: port,
    cors: true,
    graphiql: true,
    playground: true,
})
