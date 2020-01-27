import {defaultServer} from "@microframework/node";
import {debugLogger} from "@microframework/logger";
import {defaultValidator} from "@microframework/validator";
import {createConnection} from "typeorm";
import {app} from "./app";
import {CategoryEntity} from "./entity/CategoryEntity";
import {PostEntity} from "./entity/PostEntity";
import {UserEntity} from "./entity/UserEntity";
import {UserType} from "./model/User";
import {CategoryDeclarationResolver} from "./resolver/CategoryDeclarationResolver";
import {PostDeclarationResolver} from "./resolver/PostDeclarationResolver";
import {SearchDeclarationResolver} from "./resolver/SearchDeclarationResolver";
import {PostValidator} from "./validator/PostValidator";
import {PubSub} from "graphql-subscriptions";

export const PubSubImpl = new PubSub()

app
    .setEntities([
        CategoryEntity,
        PostEntity,
        UserEntity,
    ])
    .setResolvers([
        // PostDeclarationResolver,
        // CategoryDeclarationResolver,
        // SearchDeclarationResolver,
    ])
    .setValidationRules([
        PostValidator,
    ])
    .setDataSource(entities => {
        return createConnection({
            type: "sqlite",
            database: __dirname + "/../database.sqlite",
            entities: entities,
            synchronize: true,
            logging: false,
        })
    })
    .setContext({
        currentUser: async () => {
            const user = await app.properties.dataSource!!.getRepository<UserType>("UserType").findOne(1)
            if (!user)
                return { id: 0 }

            return {
                id: user.id
            }
        }
    })
    .setValidator(defaultValidator)
    .setLogger(debugLogger)
    .setGenerateModelRootQueries(true)
    .bootstrap(
        defaultServer(app, {
            appPath: __dirname + "/app",
            port: 3000,
            websocketPort: 3001,
            cors: true,
            graphiql: true,
            playground: true,
            pubSub: PubSubImpl,
        })
    )
    .then(() => {
        console.log("Running a GraphQL API at http://localhost:3000/graphql")
    })
    .catch(error => {
        console.log("Error: ", error)
    })
