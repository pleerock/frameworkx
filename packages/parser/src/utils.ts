import * as ts from "typescript";

/**
 * Checks if given node is exported or not.
 */
export function isNodeExported(node: ts.Node): boolean {
    return (
        (ts.ModifierFlags.Export) !== 0 ||
        (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
    );
}

/**
 * Finds a property in a given type literal.
 */
export function findTypeLiteralProperty(node: ts.TypeLiteralNode, propertyName: string): ts.PropertySignature | undefined {
    for (let member of node.members) {
        if (ts.isPropertySignature(member) &&
            ts.isIdentifier(member.name) &&
            member.name.text === propertyName) {
            return member
        }
    }
    return undefined
}

export function camelize(str: string) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index == 0 ? match.toLowerCase() : match.toUpperCase();
    });
}

export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const ParserUtils = {

    normalizeTextSymbol(symbol: string): string {
        if (symbol.substr(0, 1) === `"`) {
            symbol = symbol.substr(1)
        }
        if (symbol.substr(-1) === `"`) {
            symbol = symbol.substr(0, symbol.length - 1)
        }
        return symbol
    },

    joinStrings(...args: string[]): string {
        return args
            .filter(str => str !== "")
            .join(".")
    }

}