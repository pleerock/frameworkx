# CLI

Use `npx @microframework/core [command]` where `command` is one of the following commands:

* `init [name]` - creates a new microframework boilerplate project.

    `name` is a name of a newly created project.

    Options:
    
    * `-d, --destination` - destination directory where project needs to be created
    * `-t, --type` - Project structure type. Can be one of the following values: monolith, monorepo, microservices
    
    Examples:
    
    ```shell script
    npx @microframework/core init my-project --destination projects/ --type monorepo
    ```
  
* `generate:metadata [appFilePath]` - Generates application metadata file from a given app .ts / .d.ts file.

    `appFilePath` is a path to the [application declaration file](application-declaration.md).
    Filename in the path should not contain extension.

    Examples:
    
    ```shell script
    npx @microframework/core generate:metadata ./src/App
    ```