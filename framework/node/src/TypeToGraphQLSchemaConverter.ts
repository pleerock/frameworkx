import { AnyApplication, DeclarationResolverFn, SubscriptionResolverFn, TypeMetadata } from "@microframework/core";
import { isModel } from "@microframework/model";
import {
    GraphQLBoolean,
    GraphQLEnumType,
    GraphQLEnumValueConfigMap,
    GraphQLFieldConfigMap,
    GraphQLFloat,
    GraphQLInputFieldConfigMap,
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from "graphql";
import { PubSub, withFilter } from "graphql-subscriptions";
import { GraphQLUnionType } from "graphql/type/definition";
import { LoggerHelper } from "./LoggerHelper";
import { Utils } from "./utils";
import { validate } from "./validator";
import DataLoader = require("dataloader");

export type GraphQLResolver = {
    name: string
    schema: { [key: string]: any }
    dataLoaderSchema: { [key: string]: any }
}

const withCancel = (asyncIterator: any, onCancel: () => any) => {
    const asyncReturn = asyncIterator.return;

    asyncIterator.return = () => {
        onCancel();
        return asyncReturn ? asyncReturn.call(asyncIterator) : Promise.resolve({ value: undefined, done: true });
    };

    return asyncIterator;
};

export class TypeToGraphQLSchemaConverter {

    app: AnyApplication
    enums: GraphQLEnumType[] = []
    unions: GraphQLUnionType[] = []
    types: GraphQLObjectType[] = [] // todo: rename to objectTypes
    inputTypes: GraphQLInputObjectType[] = []
    pubSub?: PubSub
    // const result =  todo: generateEntityResolvers(app)

    constructor(options: {
        app: AnyApplication
        pubSub: PubSub | undefined
    }) {
        this.app = options.app
        this.pubSub = options.pubSub

        this.app.metadata.models
            .filter(model => model.kind === "enum")
            .forEach(model => this.takeGraphQLEnum(model))
        this.app.metadata.models
            .filter(model => model.kind === "union")
            .forEach(model => this.takeGraphQLUnion(model))
        this.app.metadata.models
            .filter(model => model.kind === "object" || model.kind === "model")
            .forEach(model => this.takeGraphQLType(model))

        this.app.metadata.inputs.forEach(input => this.typeMetadataToGraphQLInputType(input))
    }

    /**
     * Resolves a final GraphQL input / object type for a given type metadata.
     */
    private resolveGraphQLType(mode: "input" | "object", type: TypeMetadata): any {
        if (!type.nullable) {
            const subConverted = this.resolveGraphQLType(mode, { ...type, nullable: true })
            return GraphQLNonNull(subConverted)

        } else if (type.array) {
            const subConverted = this.resolveGraphQLType(mode, { ...type, array: false })
            return GraphQLList(subConverted)

        } else if (type.kind === "boolean") {
            return GraphQLBoolean

        } else if (type.kind === "string") {
            return GraphQLString

        } else if (type.kind === "number") {
            return GraphQLInt

        } else if (type.typeName === "Float") {
            return GraphQLFloat

        } else if (type.kind === "enum") {
            return this.takeGraphQLEnum(type)

        } else if (type.kind === "union") {
            return this.takeGraphQLUnion(type)

        } else {
            if (mode === "input") {
                return this.typeMetadataToGraphQLInputType(type)

            } else {
                return this.takeGraphQLType(type)
            }
        }
    }

    /**
     * If given value is input or object type - returns it fields.
     * Otherwise just returns a value (we expect it to be a primitive).
     */
    private destructGraphQLType(inputType: any): any {
        if (inputType instanceof GraphQLNonNull) {
            return this.destructGraphQLType(inputType.ofType)

        } else if (inputType instanceof GraphQLList) {
            return this.destructGraphQLType(inputType.ofType)

        } else if (inputType instanceof GraphQLInputObjectType) {
            return inputType.getFields()

        } else if (inputType instanceof GraphQLObjectType) {
            return inputType.getFields()

        }

        return inputType
    }

    /**
     * Converts a given declarations (query, mutation or subscription) into GraphQLObjectType.
     */
    declarationToGraphQLObjectType(type: "query" | "mutation" | "subscription", metadatas: TypeMetadata[]): GraphQLObjectType {
        const fields: GraphQLFieldConfigMap<any, any> = {}
        for (let metadata of metadatas) {
            if (!metadata.propertyName) continue

            let resolveType: any
            if (!metadata.typeName && metadata.modelName) {
                const metadataModel = this.app.metadata.models.find(model => {
                    return model.modelName === metadata.modelName
                })
                if (metadataModel) {
                    resolveType = this.resolveGraphQLType("object", { ...metadata, typeName: metadataModel.typeName })
                }
            } else if (metadata.typeName) {
                const metadataModel = this.app.metadata.models.find(model => model.typeName === metadata.typeName)
                if (metadataModel) {
                    // console.log(metadataModel);
                    resolveType = this.resolveGraphQLType("object", { ...metadata, kind: metadataModel.kind })
                }
            } else {
                resolveType = this.resolveGraphQLType("object", metadata)
            }

            // console.log(metadata);

            fields[metadata.propertyName] = {
                type: resolveType,
                description: metadata.description,
            }
            if (type === "query" || type === "mutation") {
                fields[metadata.propertyName].resolve = this.findDeclarationMetadataResolverFn(type, metadata)
            } else {
                fields[metadata.propertyName].resolve = (val: any) => val
            }
            if (metadata.args) {
                fields[metadata.propertyName].args = this.destructGraphQLType(this.resolveGraphQLType("input", metadata.args))
            }

            if (type === "subscription") {
                if (!this.pubSub)
                    throw new Error("PubSub isn't registered!")

                let subscriptionResolverFn: any /*SubscriptionResolverFn<any, any>*/ | undefined = undefined
                for (let resolver of this.app.properties.resolvers) {
                    if (resolver.type === "declaration-resolver") {
                        if (resolver.declarationType === "any" || resolver.declarationType === "subscription") {
                            if ((resolver.resolverFn as any)[metadata.propertyName] !== undefined) {
                                subscriptionResolverFn = (resolver.resolverFn as any)[metadata.propertyName].bind(resolver.resolverFn) // (...args: any[]) => (resolver.resolverFn as any)[name](...args)
                            }
                        }
                    } else if (resolver.type === "declaration-item-resolver") {
                        if (resolver.declarationType === "any" || resolver.declarationType === "subscription") {
                            if (resolver.name === metadata.propertyName) {
                                subscriptionResolverFn = resolver.resolverFn as SubscriptionResolverFn<any, any>
                            }
                        }
                    }
                }
                // todo: do we need this check?
                // if (!subscriptionResolverFn)
                //     throw new Error(`Subscription resolver ${metadata.propertyName} was not found`)

                if (subscriptionResolverFn) {
                    if (subscriptionResolverFn.filter) {
                        // console.log('with filter"')
                        fields[metadata.propertyName].subscribe = (_, args) => {
                            return withFilter(
                                () => this.pubSub!!.asyncIterator(subscriptionResolverFn.triggers),
                                subscriptionResolverFn.filter!
                            )
                        }
                    } else {
                        fields[metadata.propertyName].subscribe = (_, args, context) => {
                            if (subscriptionResolverFn.onSubscribe) {
                                if (metadata.args !== undefined) {
                                    subscriptionResolverFn.onSubscribe(args, context)
                                }  else {
                                    subscriptionResolverFn.onSubscribe(context)
                                }
                            }
                            if (subscriptionResolverFn.onUnsubscribe) {
                                return withCancel(this.pubSub!!.asyncIterator(subscriptionResolverFn.triggers), () => {
                                    // todo: we need to send args if args were defined
                                    if (metadata.args !== undefined) {
                                        subscriptionResolverFn.onUnsubscribe!!(args, context)
                                    }  else {
                                        subscriptionResolverFn.onUnsubscribe!!(context)
                                    }
                                })
                            }
                            return this.pubSub!!.asyncIterator(subscriptionResolverFn.triggers)
                        }
                    }
                }
            }
        }

        const description =
            (type === "query") ? "Root queries." :
            (type === "mutation") ? "Root mutations." :
            (type === "subscription") ? "Root subscriptions." :
            ""

        const typeName =
            (type === "query") ? "Query" :
            (type === "mutation") ? "Mutation" :
            (type === "subscription") ? "Subscription" :
            ""

        return new GraphQLObjectType({
            name: typeName,
            description,
            fields: fields
        })
    }

    /**
     * Creates GraphQLInputObjectType for the given input blueprint with the given name.
     * If such type was already created, it returns its instance.
     */
    typeMetadataToGraphQLInputType(metadata: TypeMetadata): GraphQLInputObjectType {
        // todo: check if typeName isn't empty?
        let typeName = metadata.typeName
        if (!typeName) {
            typeName = Utils.generateRandomString(10) + "Input"
        }

        // check if we already have a type with such name
        const existType = this.inputTypes.find(inputType => inputType.name === typeName)
        if (existType)
            return existType

        // create a new type and return it back
        const newType = new GraphQLInputObjectType({
            name: typeName,
            description: metadata.description,
            fields: () => {
                // if we don't have such type yet, create a new one
                // start with creating type fields
                const fields: GraphQLInputFieldConfigMap = {}
                for (const property of metadata.properties) {
                    if (property.propertyName) {
                        fields[property.propertyName] = {
                            type: this.resolveGraphQLType("input", property),
                            description: property.description
                        }
                    }
                }
                return fields
            }
        })
        this.inputTypes.push(newType)
        return newType
    }

    private findDeclarationMetadataResolverFn(
        mode: "query" | "mutation",
        metadata: TypeMetadata
    ) {
        const loggerHelper = new LoggerHelper(this.app)

        if (!metadata.propertyName)
            throw new Error("No name in metadata")

        let resolverFn: DeclarationResolverFn<any, any> | undefined = undefined
        for (let resolver of this.app.properties.resolvers) {
            if (resolver.type === "declaration-resolver") {
                if (resolver.declarationType === "any" || resolver.declarationType === mode) {
                    if ((resolver.resolverFn as any)[metadata.propertyName] !== undefined) {
                        resolverFn = (resolver.resolverFn as any)[metadata.propertyName].bind(resolver.resolverFn) // (...args: any[]) => (resolver.resolverFn as any)[name](...args)
                    }
                }
            } else if (resolver.type === "declaration-item-resolver") {
                if (resolver.declarationType === "any" || resolver.declarationType === mode) {
                    if (resolver.name === metadata.propertyName) {
                        resolverFn = resolver.resolverFn as SubscriptionResolverFn<any, any>
                    }
                }
            }
        }
        // todo: do we need to throw error?
        if (!resolverFn)
            return undefined

        return async (parent: any, args: any, context: any, info: any) => {
            try {
                loggerHelper.logBeforeResolve({ mode, typeName: "", propertyName: metadata.propertyName!, args, context, info, parent })
                const userContext = await this.resolveContextOptions({ request: context.request, response: context.response })

                // perform args validation
                if (metadata.args) {
                    await validate("input", this.app, metadata.args, args, userContext)
                }

                // execute the resolver and get the value it returns
                let returnedValue: any
                if (resolverFn instanceof Function) {
                    if (metadata.args) {
                        returnedValue = await resolverFn(args, userContext)
                    } else {
                        returnedValue = await resolverFn(userContext)
                    }
                } else {
                    returnedValue = resolverFn
                }

                // perform returning value model validation
                // console.log("validating model", returnedValue, blueprint)
                await validate("model", this.app, metadata, returnedValue, userContext)

                // after-logging
                this.app.properties.logger.logGraphQLResponse({
                    app: this.app,
                    name: metadata.propertyName!,
                    propertyName: metadata.propertyName!,
                    content: returnedValue,
                    parent,
                    args,
                    context,
                    info,
                    request: context.request
                })
                return returnedValue

            } catch (error) {
                this.handlerError({
                    name: metadata.propertyName!,
                    propertyName: metadata.propertyName!,
                    error,
                    parent,
                    args,
                    context,
                    info,
                    request: context.request
                })
                throw error
            }
        }
    }

    private findTypeMetadataResolverFn(
        modelName: string,
        metadata: TypeMetadata
    ) {
        const loggerHelper = new LoggerHelper(this.app)

        if (!metadata.propertyName)
            throw new Error("No property name in metadata")

        let resolverFn: DeclarationResolverFn<any, any> | undefined = undefined
        for (let resolver of this.app.properties.resolvers) {
            if (resolver.type === "model-resolver" && resolver.dataLoader === false) {
                if ((resolver.resolverFn as any)[metadata.propertyName] !== undefined) {
                    resolverFn = (resolver.resolverFn as any)[metadata.propertyName].bind(resolver.resolverFn) // (...args: any[]) => (resolver.resolverFn as any)[name](...args)
                }
            }
        }
        // todo: do we need to throw error?
        // if (!resolverFn)
        //     return undefined

        // check if we have a resolver defined for this model and property
        // const resolver = this.app.properties.resolvers.find(resolver => {
        //     return (
        //         resolver.type === "model" &&
        //         resolver.name === modelName &&
        //         resolver.schema !== undefined &&
        //         resolver.schema[metadata.propertyName!!] !== undefined
        //     )
        // })
        // console.log(modelName, resolver);

        if (resolverFn) {
            // const propertyResolver = resolver.schema!![metadata.propertyName!!]

            return async (parent: any, args: any, context: any, info: any) => {
                try {
                    loggerHelper.logBeforeResolve({ mode: "model", typeName: modelName, propertyName: metadata.propertyName!!, args, context, info, parent })
                    const userContext = await this.resolveContextOptions({ request: context.request, response: context.response })

                    // perform args validation
                    if (metadata.args) {
                        await validate("input", this.app, metadata.args, args, userContext)
                    }

                    // execute the resolver and get the value it returns
                    let returnedValue: any
                    if (resolverFn instanceof Function) {
                        if (metadata.args) {
                            returnedValue = await resolverFn(parent, args, userContext)
                        } else {
                            returnedValue = await resolverFn(parent, userContext)
                        }
                    } else {
                        returnedValue = resolverFn
                    }

                    // perform returning value model validation
                    // console.log("validating model", returnedValue, blueprint)
                    await validate("model", this.app, metadata, returnedValue, userContext)

                    // after-logging
                    this.app.properties.logger.logGraphQLResponse({
                        app: this.app,
                        name: modelName,
                        propertyName: metadata.propertyName!!,
                        content: returnedValue,
                        parent,
                        args,
                        context,
                        info,
                        request: context.request
                    })
                    return returnedValue

                } catch (error) {
                    this.handlerError({
                        name: modelName,
                        propertyName: metadata.propertyName!!,
                        error,
                        parent,
                        args,
                        context,
                        info,
                        request: context.request
                    })
                    throw error
                }
            }
        }

        let dataLoaderResolverFn: DeclarationResolverFn<any, any> | undefined = undefined
        for (let resolver of this.app.properties.resolvers) {
            if (resolver.type === "model-resolver" && resolver.dataLoader === true) {
                if ((resolver.resolverFn as any)[metadata.propertyName] !== undefined) {
                    dataLoaderResolverFn = (resolver.resolverFn as any)[metadata.propertyName].bind(resolver.resolverFn) // (...args: any[]) => (resolver.resolverFn as any)[name](...args)
                }
            }
        }
        if (/*!resolve && */dataLoaderResolverFn) {
            return (parent: any, args: any, context: any, info: any) => {
                this.app.properties.logger.resolveModel({
                    app: this.app,
                    name: modelName,
                    propertyName: metadata.propertyName!!,
                    parent,
                    args,
                    context,
                    info,
                    request: context.request
                })

                if (!context.dataLoaders)
                    context.dataLoaders = {};
                if (!context.dataLoaders[modelName])
                    context.dataLoaders[modelName] = {};

                // define data loader for this method if it was not defined yet
                if (!context.dataLoaders[modelName][metadata.propertyName!!]) {
                    context.dataLoaders[modelName][metadata.propertyName!!] = new DataLoader((keys: { parent: any, args: any, context: any, info: any }[]) => {
                        const entities = keys.map(key => key.parent)

                        if (!(dataLoaderResolverFn instanceof Function))
                            return dataLoaderResolverFn as any

                        return this
                            .resolveContextOptions({ request: context.request, response: context.response })
                            .then(context => {
                                if (metadata.args) {
                                    return (dataLoaderResolverFn as any)(entities, keys[0].args, context) // keys[0].info
                                } else {
                                    return (dataLoaderResolverFn as any)(entities, context) // keys[0].info
                                }
                            })
                            .then(result => {
                                this.app.properties.logger.logGraphQLResponse({
                                    app: this.app,
                                    name: modelName,
                                    propertyName: metadata.propertyName!!,
                                    content: result,
                                    parent,
                                    args,
                                    context,
                                    info,
                                    request: context.request
                                })
                                return result
                            })
                            .catch(error => this.handlerError({
                                name: modelName,
                                propertyName: metadata.propertyName!!,
                                error,
                                parent,
                                args,
                                context,
                                info,
                                request: context.request
                            }))
                    }, {
                        cacheKeyFn: (key: { parent: any, args: any, context: any, info: any }) => {
                            return JSON.stringify({ parent: key.parent, args: key.args });
                        }
                    })
                }

                return context.dataLoaders[modelName][metadata.propertyName!!].load({ parent, args, context, info })
            }
        }

        // if no resolver is defined check if we this model has entity and check if this entity property must be resolved
        if (this.app.properties.dataSource) {
            const entity = this
                .app
                .properties
                .entities
                .find(entity => {
                    if (isModel(entity.name)) {
                        return entity.name.name === modelName
                    }

                    return entity.name === modelName
                })

            if (entity) {
                const entityMetadata = this.app.properties.dataSource.getMetadata(modelName)
                if (entity.entityResolveSchema === true || (entity.entityResolveSchema instanceof Object && entity.entityResolveSchema[metadata.propertyName!!] === true)) {
                    const entityRelation = entityMetadata.relations.find(relation => relation.propertyName === metadata.propertyName!!)
                    if (entityRelation) {
                        return ((parent: any, args: any, context: any, info: any) => {
                            this.app.properties.logger.resolveModel({
                                app: this.app,
                                name: modelName,
                                propertyName: metadata.propertyName!!,
                                parent,
                                args,
                                context,
                                info,
                                request: context.request
                            })

                            if (!context.dataLoaders)
                                context.dataLoaders = {};
                            if (!context.dataLoaders[modelName])
                                context.dataLoaders[modelName] = {};

                            // define data loader for this method if it was not defined yet
                            if (!context.dataLoaders[modelName][metadata.propertyName!!]) {
                                context.dataLoaders[modelName][metadata.propertyName!!] = new DataLoader((keys: { parent: any, args: any, context: any, info: any }[]) => {
                                    const entities = keys.map(key => key.parent)
                                    return this.app.properties.dataSource!
                                        .relationIdLoader
                                        .loadManyToManyRelationIdsAndGroup(entityRelation, entities)
                                        .then(groups => groups.map(group => group.related))
                                        .then(result => {
                                            this.app.properties.logger.logGraphQLResponse({
                                                app: this.app,
                                                name: modelName,
                                                propertyName: metadata.propertyName!!,
                                                content: result,
                                                parent,
                                                args,
                                                context,
                                                info,
                                                request: context.request
                                            })
                                            return result
                                        })
                                        .catch(error => this.handlerError({
                                            name: modelName,
                                            propertyName: metadata.propertyName!!,
                                            error,
                                            parent,
                                            args,
                                            context,
                                            info,
                                            request: context.request
                                        }) as any)
                                }, {
                                    cacheKeyFn: (key: { parent: any, args: any, context: any, info: any }) => {
                                        return JSON.stringify({ parent: key.parent, args: key.args });
                                    }
                                })
                            }

                            return context.dataLoaders[modelName][metadata.propertyName!!].load({ parent, args, context, info })
                        })
                    }
                }
            }
        }
    }

    takeGraphQLEnum(metadata: TypeMetadata): GraphQLEnumType {

        // check if we already have enum with such name
        const existEnum = this.enums.find(type => type.name === metadata.typeName)
        if (existEnum)
            return existEnum

        // if we don't have such enum yet, create a new one
        // start with creating type fields
        const values = metadata.properties.reduce((values, property, index) => {
            if (property.propertyName) {
                values[property.propertyName] = {
                    description: property.description,
                    value: property.propertyName
                }
            }
            return values
        }, {} as GraphQLEnumValueConfigMap)

        if (!metadata.typeName)
            throw new Error("Metadata doesn't have a name, cannot create enum")

        // create a new type and return it back
        const newEnum = new GraphQLEnumType({
            name: metadata.typeName,
            description: metadata.description,
            values: values
        })

        this.enums.push(newEnum)
        return newEnum
    }

    takeGraphQLUnion(metadata: TypeMetadata): GraphQLUnionType {

        // check if we already have union with such name
        const existUnion = this.unions.find(type => type.name === metadata.typeName)
        if (existUnion)
            return existUnion

        if (!metadata.typeName)
            throw new Error("Metadata doesn't have a name, cannot create union")

        // create a new type and return it back
        const newUnion = new GraphQLUnionType({
            name: metadata.typeName,
            description: metadata.description,
            types: () => {
                return metadata.properties.map(property => {
                    const type = this.types.find(type => type.name === property.typeName)
                    if (!type)
                        throw new Error("cannot find type from union type")

                    return type
                })
            },
            // resolveType: (obj) => {
            //     console.log(obj)
            //     return ""
            // }
        })

        this.unions.push(newUnion)
        return newUnion
    }

    /**
     * Creates GraphQLObjectType for the given blueprint with the given name.
     * If such type was already created, it returns its instance.
     */
    takeGraphQLType(metadata: TypeMetadata): GraphQLObjectType {

        let typeName = metadata.typeName
        if (!typeName) {
            // console.log(metadata);
            throw new Error("Metadata doesn't have a name, cannot create object")
        }

        // check if we already have a type with such name
        const existType = this.types.find(type => type.name === typeName)
        if (existType)
            return existType

        // create a new type and return it back
        const newType = new GraphQLObjectType({
            name: typeName,
            description: metadata.description,
            fields: () => {
                // if we don't have such type yet, create a new one
                // start with creating type fields
                const fields: GraphQLFieldConfigMap<any, any> = {}
                for (const property of metadata.properties) {
                    if (property.propertyName) { // todo: throw error instead?
                        const resolve = this.findTypeMetadataResolverFn(typeName!!, property)
                        fields[property.propertyName] = {
                            type: this.resolveGraphQLType("object", property),
                            description: property.description,
                            resolve
                        }
                        if (property.args) {
                            const argsInput = this.resolveGraphQLType("input", property.args)
                            fields[property.propertyName].args = this.destructGraphQLType(argsInput)
                        }
                    }
                }
                return fields
            }
        })
        this.types.push(newType)
        return newType
    }

    private handlerError({
                             name,
                             propertyName,
                             parent,
                             args,
                             context,
                             info,
                             error,
                             request,
                         }: {
        name: string
        propertyName: string
        parent: any
        args: any
        context: any
        info: any
        error: any
        request: any
    }) {
        if (name === "Query") {
            this.app.properties.logger.resolveQueryError({
                app: this.app,
                propertyName,
                error,
                args,
                context,
                info,
                request
            })
        } else if (name === "Mutation") {
            this.app.properties.logger.resolveMutationError({
                app: this.app,
                propertyName,
                error,
                args,
                context,
                info,
                request
            })
        } else {
            this.app.properties.logger.resolveModelError({
                app: this.app,
                name,
                propertyName,
                error,
                parent,
                args,
                context,
                info,
                request
            })
        }

        return this.app.properties.errorHandler.resolverError({
            app: this.app,
            name,
            error,
            propertyName,
            parent,
            args,
            context,
            info,
            request
        })
    }
    /**
     * Resolves context value.
     */
    private async resolveContextOptions(options: { request: Request, response: Response }) {
        let resolvedContext: { [key: string]: any } = {
            // we can define default framework context variables here
            request: options.request,
            response: options.response
        }
        for (const key in this.app.properties.context) {
            const contextResolverItem = this.app.properties.context[key]
            let result = contextResolverItem instanceof Function ? contextResolverItem(options) : contextResolverItem
            if (result instanceof Promise) {
                result = await result
            }
            resolvedContext[key] = result
        }
        return resolvedContext
    }

}