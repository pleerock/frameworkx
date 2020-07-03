import { DocumentNode } from "graphql"

const fetch = require("node-fetch")

export class TestFetcher {
  constructor(private url: string) {}

  async get() {
    const response = await fetch(this.url, {
      method: "GET",
    })
    return this.handleJsonResponse(response)
  }

  async graphql(gql: string | DocumentNode) {
    const body = typeof gql === "string" ? gql : gql.loc?.source.body
    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: body,
      }),
    })
    return this.handleJsonResponse(response)
  }

  private async handleJsonResponse(response: any) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response.json())
    }

    let error: any
    try {
      error = await response.json()
    } catch (err) {}
    if (!error) {
      error = response.statusText || String(response.status)
    }

    // console.error(await response.json())
    throw error
  }
}
