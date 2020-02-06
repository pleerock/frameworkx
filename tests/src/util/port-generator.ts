export function obtainPort(): Promise<number> {
    const fp = require("find-free-port")
    return new Promise<number>((ok, fail) => {
        fp(9999, 99999, function(err: any, freePort: number) {
            if (err) return fail(err)
            ok(freePort)
        })
    })
}