# Project Structure

## Using CLI

### Create a project

You can use microframework's CLI to generate a project scaffold.
Use following command to generate a new `my-project` directory with a new project inside:

```
npx @microframework/core init my-project
```

There are 3 types of project skeletons you can generate:

* monolith []
* monorepo []
* microservices []

By default `init` command generates a monolith skeleton.
You can use a `--type` option to generate a different skeleton, e.g.

```
npx @microframework/core init my-project --type monorepo
```

`monorepo` and `microservices` are advanced skeleton types, 
for beginners it's recommended to use a `monolith` skeleton type.

### Install dependencies

Install all `node_modules` dependencies:

```
cd my-project
npm install
```


### Run the project

To run the project just run `npm start`.
Your `my-project` application is now running on http://localhost:3000.

Now you can open `my-project` directory in your favorite code editor and start tweaking things.


## Manual installation


