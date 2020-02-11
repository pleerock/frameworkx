import { DefaultContext, Logger, ResolverType, TypeMetadata } from "@microframework/core";
import { ActionEvent } from "./action/ActionEvent";

export type GraphQLResolveArgs = {
    parent: any
    args: any
    context: any
    info: any
}

export type ResolveLogInfo = {
    type: ResolverType
    metadata: TypeMetadata
    args: GraphQLResolveArgs
    defaultContext: DefaultContext
    parentTypeName?: string
}

export type ResolveLogErrorInfo = ResolveLogInfo & {
    error: any
}

export class ServerLogger {
    
    constructor(logger: Logger) {
    }

    logBeforeResolve(info: ResolveLogInfo) {
        // if (mode === "query") {
        //     this.app.properties.logger.resolveQuery({
        //         app: this.app,
        //         propertyName: propertyName,
        //         args,
        //         context,
        //         info,
        //         request: context.request
        //     })
        //
        // } else if (mode === "mutation") {
        //     this.app.properties.logger.resolveMutation({
        //         app: this.app,
        //         propertyName: propertyName,
        //         args,
        //         context,
        //         info,
        //         request: context.request
        //     })
        // } else {
        //     this.app.properties.logger.resolveModel({
        //         app: this.app,
        //         name: typeName,
        //         propertyName: propertyName,
        //         parent,
        //         args,
        //         context,
        //         info,
        //         request: context.request
        //     })
        // }
    }

    log(name: string, message: string): void { }
    error(name: string, message: string): void { }

    resolveError(args: ResolveLogErrorInfo) {
        if (args.type === "query") {
            this.resolveQueryError(args)
        } else if (args.type === "mutation") {
            this.resolveMutationError(args) // todo: subscription, action
        } else {
            this.resolveModelError(args)
        }
    }

    resolveQuery(args: ResolveLogInfo): void { }
    resolveQueryError(args: ResolveLogErrorInfo): void { }

    resolveMutation(args: ResolveLogInfo): void { }
    resolveMutationError(args: ResolveLogErrorInfo): void { }

    resolveModel(args: ResolveLogInfo): void { }
    resolveModelError(args: ResolveLogErrorInfo): void { }

    resolveAction(args: ActionEvent): void { }
    resolveActionError(args: ActionEvent & {
        error: any
    }): void { }

    logActionResponse(args: ActionEvent & {
        content: any
    }): void { }
    logGraphQLResponse(args: ResolveLogInfo & {
        content: any
    }): void { }

/*
    resolveQuery({ propertyName, args }) {
        return debug(`microframework:query:${propertyName}`)(`${JSON.stringify(args)}`)
    },
    resolveQueryError({ propertyName, error }) {
        error = typeof error === "object" ? JSON.stringify(error) : error
        return debug(`microframework:query:${propertyName}`)(error)
    },

    resolveMutation({ propertyName, args }) {
        return debug(`microframework:mutation:${propertyName}`)(`${JSON.stringify(args)}`)
    },
    resolveMutationError({ propertyName, error }) {
        error = typeof error === "object" ? JSON.stringify(error) : error
        return debug(`microframework:mutation:${propertyName}`)(error)
    },

    resolveModel({ name, propertyName, args }) {
        return debug(`microframework:model:${name}:${propertyName}`)(`${JSON.stringify(args)}`)
    },
    resolveModelError({ name, propertyName, error }) {
        error = typeof error === "object" ? JSON.stringify(error) : error
        return debug(`microframework:model:${name}:${propertyName}`)(error)
    },

    resolveAction({ method, route }) {
        return debug(`microframework:action:${route} (${method})`)("")
    },
    resolveActionError({ method, route, error }) {
        error = typeof error === "object" ? JSON.stringify(error) : error
        return debug(`microframework:action:${route} (${method})`)(error)
    },

    logActionResponse({
                          app,
                          route,
                          method,
                          content,
                      }) {
        content = typeof content === "object" ? JSON.stringify(content) : content
        return debug(`microframework:action:${route} (${method})`)(content)
    },

    logGraphQLResponse({
                           app,
                           name,
                           propertyName,
                           args,
                           context,
                           info,
                           request,
                           content,
                       }) {
        const type = name === "Query" || name === "Mutation" ? name.toLowerCase() : `model:${name}`
        content = typeof content === "object" ? JSON.stringify(content) : content
        return debug(`microframework:${type}${propertyName ? ":" + propertyName : ""}`)(`${JSON.stringify(args)}: ${content}`)
    }*/

}
