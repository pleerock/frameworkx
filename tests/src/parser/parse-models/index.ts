import { parse } from "@microframework/parser"

describe("parse models", () => {

    test('model defined as a type', () => {
        const result = parse(__dirname + "/app/type-app.ts")
        console.log(JSON.stringify(result, undefined, 2))
        // expect(result).toEqual({})
    })

    test('model defined as a Model with args', () => {
        const result = parse(__dirname + "/app/model-app.ts")
        console.log(JSON.stringify(result, undefined, 2))
        // expect(result).toEqual({})
    })

    test('model defined as a Model without args', () => {
        const result = parse(__dirname + "/app/model-no-args-app.ts")
        console.log(JSON.stringify(result, undefined, 2))
        // expect(result).toEqual({})
    })

    test('model defined as a class', () => {
        const result = parse(__dirname + "/app/class-app.ts")
        console.log(JSON.stringify(result, undefined, 2))
        // expect(result).toEqual({})
    })

    test('model defined as an interface', () => {
        const result = parse(__dirname + "/app/interface-app.ts")
        console.log(JSON.stringify(result, undefined, 2))
        // expect(result).toEqual({})
    })

    test('model defined as intersection type', () => {
        const result = parse(__dirname + "/app/intersection-type-app.ts")
        console.log(JSON.stringify(result, undefined, 2))
        // expect(result).toEqual({})
    })

    test('model with different types in', () => {
        const result = parse(__dirname + "/app/different-models-app.ts")
        console.log(JSON.stringify(result, undefined, 2))
        // expect(result).toEqual({})
    })

    test('model with complex type', () => {
        const result = parse(__dirname + "/app/complex-type-app.ts")
        console.log(JSON.stringify(result, undefined, 2))
        // expect(result).toEqual({})
    })

    test('model with literal type', () => {
        const result = parse(__dirname + "/app/literal-type-app.ts")
        console.log(JSON.stringify(result, undefined, 2))
        // expect(result).toEqual({})
    })

})
