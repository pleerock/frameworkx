import { App } from "./fetcher-test-app/app"
import { createFetcher, Fetcher } from "@microframework/fetcher"
import { obtainPort } from "../util/test-common"
import { AppServer } from "./fetcher-test-app/server"
import { ApplicationServer } from "@microframework/node"

describe("fetcher > actions", () => {
  let fetcher: Fetcher<any> | undefined = undefined
  let webserverPort: number = 0
  let server: ApplicationServer<any> | undefined = undefined

  beforeEach(async () => {
    webserverPort = await obtainPort()
    server = await AppServer(webserverPort, 0).start()
    fetcher = createFetcher({
      clientId: "jest-test-fetcher",
      actionEndpoint: `http://localhost:${webserverPort}`,
    })
  })

  afterEach(async () => {
    if (server) {
      await server.stop()
    }
  })

  test("path params should be sent in a request", async () => {
    const params = {
      number: 1,
      string: "ASD12345",
      boolean: true,
      bigint: BigInt(900719925474099),
      bigintObj: BigInt(9007199254740991),
      date: new Date(),
      dateTime: new Date(),
      time: new Date(),
      float: 2.5,
      object: {
        id: 1,
        name: "Admin",
      },
    }

    const postRequest = App.request(
      App.action(
        "GET /posts-params/:number/:string/:boolean/:bigint/:bigintObj/:date/:dateTime/:time/:float/:object",
        {
          params,
        },
      ),
    )

    const result = await fetcher!.fetch(postRequest)
    expect(result.number).toEqual(params.number)
    expect(result.string).toEqual(params.string)
    expect(result.boolean).toEqual(params.boolean)
    expect(result.bigint).toEqual(params.bigint.toString())
    expect(result.bigintObj).toEqual(params.bigintObj.toString())
    expect(result.date).toEqual(
      `${params.date.getFullYear()}-${params.date.getMonth()}-${params.date.getDate()}`,
    )
    expect(result.dateTime).toEqual(params.dateTime.toISOString())
    expect(result.time).toEqual(
      `${params.time.getHours()}:${params.time.getMinutes()}:${params.time.getSeconds()}.${params.time.getMilliseconds()}Z`,
    )
    expect(result.float).toEqual(params.float)
    expect(result.object).toEqual(params.object)
  })

  test("query params should be sent in a request", async () => {
    const query = {
      number: 1,
      string: "ASD12345",
      boolean: true,
      bigint: BigInt(900719925474099),
      bigintObj: BigInt(9007199254740991),
      date: new Date(),
      dateTime: new Date(),
      time: new Date(),
      float: 2.5,
      object: {
        id: 1,
        name: "Admin",
      },
    }
    const postsRequest = App.request(
      App.action("GET /posts-query", {
        query,
      }),
    )

    const result = await fetcher!.fetch(postsRequest)
    expect(result.number).toEqual(query.number)
    expect(result.string).toEqual(query.string)
    expect(result.boolean).toEqual(query.boolean)
    expect(result.bigint).toEqual(query.bigint.toString())
    expect(result.bigintObj).toEqual(query.bigintObj.toString())
    expect(result.date).toEqual(
      `${query.date.getFullYear()}-${query.date.getMonth()}-${query.date.getDate()}`,
    )
    expect(result.dateTime).toEqual(query.dateTime.toISOString())
    expect(result.time).toEqual(
      `${query.time.getHours()}:${query.time.getMinutes()}:${query.time.getSeconds()}.${query.time.getMilliseconds()}Z`,
    )
    expect(result.float).toEqual(query.float)
    expect(result.object).toEqual(query.object)
  })

  test("body should be sent in a request", async () => {
    const body = {
      number: 1,
      string: "ASD12345",
      boolean: true,
      bigint: BigInt(900719925474099),
      bigintObj: BigInt(9007199254740991),
      date: new Date(),
      dateTime: new Date(),
      time: new Date(),
      float: 2.5,
      object: {
        id: 1,
        name: "Admin",
      },
    }
    const postSaveRequest = App.request(
      App.action("POST /post-body", {
        body,
      }),
    )

    const result = await fetcher!.fetch(postSaveRequest)
    expect(result.number).toEqual(body.number)
    expect(result.string).toEqual(body.string)
    expect(result.boolean).toEqual(body.boolean)
    expect(result.bigint).toEqual(body.bigint.toString())
    expect(result.bigintObj).toEqual(body.bigintObj.toString())
    expect(result.date).toEqual(
      `${body.date.getFullYear()}-${body.date.getMonth()}-${body.date.getDate()}`,
    )
    expect(result.dateTime).toEqual(body.dateTime.toISOString())
    expect(result.time).toEqual(
      `${body.time.getHours()}:${body.time.getMinutes()}:${body.time.getSeconds()}.${body.time.getMilliseconds()}Z`,
    )
    expect(result.float).toEqual(body.float)
    expect(result.object).toEqual(body.object)
  })

  test("default headers should be sent in a request", async () => {})
  test("headers should be sent in a request", async () => {
    const headers = {
      number: 1,
      string: "ASD12345",
      boolean: true,
      bigint: BigInt(900719925474099),
      bigintObj: BigInt(9007199254740991),
      date: new Date(),
      dateTime: new Date(),
      time: new Date(),
      float: 2.5,
      object: {
        id: 1,
        name: "Admin",
      },
    }
    const postRequest = App.request(
      App.action("GET /posts-headers", {
        headers,
      }),
    )

    const result = await fetcher!.fetch(postRequest)
    expect(result.number).toEqual(headers.number)
    expect(result.string).toEqual(headers.string)
    expect(result.boolean).toEqual(headers.boolean)
    expect(result.bigint).toEqual(headers.bigint.toString())
    expect(result.bigintObj).toEqual(headers.bigintObj.toString())
    expect(result.date).toEqual(
      `${headers.date.getFullYear()}-${headers.date.getMonth()}-${headers.date.getDate()}`,
    )
    expect(result.dateTime).toEqual(headers.dateTime.toISOString())
    expect(result.time).toEqual(
      `${headers.time.getHours()}:${headers.time.getMinutes()}:${headers.time.getSeconds()}.${headers.time.getMilliseconds()}Z`,
    )
    expect(result.float).toEqual(headers.float)
    expect(result.object).toEqual(headers.object)
  })
  test("all headers should be sent in a request", async () => {})
})
