import {parse} from "@microframework/parser";

describe("parse selections", () => {

    test('simple selection', () => {
        const result = parse(__dirname + "/app/simple-selection-app.ts")
        console.log(JSON.stringify(result, undefined, 2));
        // expect(result).toEqual({});
    });

})
