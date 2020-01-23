import {parse} from "@microframework/parser";

describe("parse queries", () => {

    test('simple query', () => {
        const result = parse(__dirname + "/app/type-app.ts")
        console.log(JSON.stringify(result, undefined, 2));
        // expect(result).toEqual({});
    });

})
