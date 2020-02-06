import { parse } from "@microframework/parser";

describe("parse inputs", () => {

    test('input defined as a type', () => {
        const result = parse(__dirname + "/app/type-app.ts")
        console.log(JSON.stringify(result, undefined, 2));
        // expect(result).toEqual({});
    });

    test('input defined as a intersection type', () => {
        const result = parse(__dirname + "/app/intersection-type-app.ts")
        console.log(JSON.stringify(result, undefined, 2));
        // expect(result).toEqual({});
    });

    test('input defined as a class', () => {
        const result = parse(__dirname + "/app/class-app.ts")
        console.log(JSON.stringify(result, undefined, 2));
        // expect(result).toEqual({});
    });

    test('input defined as an interface', () => {
        const result = parse(__dirname + "/app/interface-app.ts")
        console.log(JSON.stringify(result, undefined, 2));
        // expect(result).toEqual({});
    });

})
