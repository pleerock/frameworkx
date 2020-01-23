import {AnyApplication, ResolverType} from "@microframework/core";

export class LoggerHelper {

    constructor(private app: AnyApplication) {
    }

    logBeforeResolve({ mode, typeName, propertyName, args, context, info, parent }: { mode: ResolverType, typeName: string, propertyName: string, args: any, context: any, info: any, parent: any }) {
        if (mode === "query") {
            this.app.properties.logger.resolveQuery({
                app: this.app,
                propertyName: propertyName,
                args,
                context,
                info,
                request: context.request
            })

        } else if (mode === "mutation") {
            this.app.properties.logger.resolveMutation({
                app: this.app,
                propertyName: propertyName,
                args,
                context,
                info,
                request: context.request
            })
        } else {
            this.app.properties.logger.resolveModel({
                app: this.app,
                name: typeName,
                propertyName: propertyName,
                parent,
                args,
                context,
                info,
                request: context.request
            })
        }
    }

}