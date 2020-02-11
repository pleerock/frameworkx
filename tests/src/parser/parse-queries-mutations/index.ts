import { parse } from "@microframework/parser"

describe("parse queries", () => {

    test('simple definitions', () => {
        const result = parse(__dirname + "/app/type-app.ts")
        console.log(JSON.stringify(result, undefined, 2))
        // expect(result).toEqual({})
    })

    test('merged definitions', () => {
        const result = parse(__dirname + "/app/merged-definitions-app.ts")
        console.log(JSON.stringify(result, undefined, 2))
        // expect(result).toEqual({})
    })

})
