import { DocumentNode } from "graphql"

const fetch = require('node-fetch')

export class GraphqlFetcher {

    constructor(private url: string) {
    }

    async fetch(gql: string | DocumentNode) {
        const body = typeof gql === "string" ? gql : gql.loc?.source.body
        const response = await fetch(this.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: body
            }),
        })
        if (response.status >= 200 && response.status < 300)
            return Promise.resolve(response.json())

        console.error(await response.json())
        throw new Error(response.statusText || String(response.status))
    }
}
