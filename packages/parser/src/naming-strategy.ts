import {camelize, capitalize} from "./utils";

export type ParserNamingStrategy = {
    enumNameFromStringLiteralUnion(name: string): string
    unionNameFromStringLiteralUnion(name: string): string
}

export const DefaultParserNamingStrategy: ParserNamingStrategy = {
    enumNameFromStringLiteralUnion(name) {
        const [typeName, propertyName] = name.split(".")
        return capitalize(camelize(`${typeName} ${propertyName}`))
    },
    unionNameFromStringLiteralUnion(name) {
        if (name.indexOf(".") === -1)
            return name

        const [typeName, propertyName] = name.split(".")
        return capitalize(camelize(`${typeName} ${propertyName}`))
    },
}