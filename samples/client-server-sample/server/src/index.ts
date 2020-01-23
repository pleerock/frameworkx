import {defaultServer} from "@microframework/node";
import {debugLogger} from "@microframework/logger";
import {defaultValidator} from "@microframework/validator";
import {createConnection} from "typeorm";
import {app} from "@microframework/client-server-sample-common";
import {CategoryEntity} from "./entity/CategoryEntity";
import {PostEntity} from "./entity/PostEntity";
import {UserEntity} from "./entity/UserEntity";
import {UserType} from "@microframework/client-server-sample-common";
import {CategoryQueryResolver} from "./resolver/CategoryQueryResolver";
import {PostsActionResolver} from "./resolver/PostsActionResolver";
import {PostSaveQueryResolver} from "./resolver/PostSaveQueryResolver";
import {PostByIdActionResolver} from "./resolver/PostByIdActionResolver";
import {PostsQueryResolver} from "./resolver/PostsQueryResolver";
import {PostTypeResolver} from "./resolver/PostTypeResolver";
import {PostValidator} from "./validator/PostValidator";

app
    .setEntities([
        CategoryEntity,
        PostEntity,
        UserEntity,
    ])
    .setResolvers([
        PostsQueryResolver,
        PostTypeResolver,
        CategoryQueryResolver,
        PostSaveQueryResolver,
        PostsActionResolver,
        PostByIdActionResolver,
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
            appPath: __dirname + "/../../common/src/app.ts",
            port: 3000,
            websocketPort: 3001,
            cors: true,
            graphiql: true,
            playground: true,
        })
    )
    .then(() => {
        console.log("Running a GraphQL API at http://localhost:3000/graphql")
    })
    .catch(error => {
        console.log("Error: ", error)
    })
