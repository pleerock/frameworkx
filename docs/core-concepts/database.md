# Database

Microframework ships with the database support out of the box.
By default, it ships an integration with [TypeORM](http://typeorm.io),
but you are free to use any ORM of your favour.

* [TypeORM integration](#typeorm-integration)
* [Establish database connection](#establish-database-connection)
* [Defining entities](#defining-entities)
* [Configuring app server](#configuring-app-server)

## TypeORM integration

The integration with TypeORM gives a following benefits:

* entity types inferred from models
* automatically generated relation resolvers
* automatically generated root queries

By default, automatically generated root queries disabled.
In order to enable it you must enable `generateModelRootQueries` option in application server options.

Microframework works with `next` version of TypeORM.
To install it, use `npm i typeorm@next` command.

## Establish database connection

Create a TypeORM `DataSource`:

```typescript
import { DataSource } from "typeorm"

const MyDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
})
```

In this example we created a connection with SQLite and store data in memory.
Follow [TypeORM](http://typeorm.io) installation guide on how to set up a
database driver you need. 

## Defining entities

It's strongly recommended to use [entity schemas](https://typeorm.io/#/separating-entity-definition)
 to define entities for your models:

```typescript
import { entity } from "typeorm"
import { App } from "../app"

export const UserEntity = entity(App.model("User"), {
  projection: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    firstName: {
      type: "varchar",
    },
    lastName: {
      type: "varchar",
    },
  },
})
```

Defined entities can be passed to TypeORM through the data source options.

## Configuring app server

To configure [application server](application-server.md) with TypeORM, 
you must specify a DataSource you have into the `dataSource` option of the application server options.

```typescript
import { createApplicationServer } from "@microframework/node"
import { MyDataSource } from "./data-source"
import { UserEntity } from "./entities"

export const AppServer = createApplicationServer(App, {
  // ...
  dataSource: () => MyDataSource.connect(),
  entities: [
    UserEntity,
    // ...
  ]
  // ...
})
```
