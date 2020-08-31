import { DocumentNode } from "graphql"

export class TestFetcher {
  constructor(private url: string) {}

  async get() {
    return this.handleJsonResponse(await this.getResponse())
  }

  async getResponse(options?: RequestInit): Promise<Response> {
    return await fetch(this.url, {
      method: "GET",
      ...(options || {}),
    })
  }

  async graphql(gql: string | DocumentNode) {
    return this.handleJsonResponse(await this.graphqlResponse(gql))
  }

  async graphqlResponse(gql: string | DocumentNode): Promise<Response> {
    const body = typeof gql === "string" ? gql : gql.loc?.source.body
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: body,
      }),
    }
    // console.log(options)
    return fetch(this.url, options)
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
