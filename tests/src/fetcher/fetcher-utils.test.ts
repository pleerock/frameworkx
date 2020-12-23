import "@microframework/fetcher"
import { App } from "./fetcher-test-app/app"
import { FetcherUtils } from "@microframework/fetcher/_/fetcher-utils"
import gql from "graphql-tag"

describe("fetcher > utils", () => {
  test("isRequestAction", async () => {
    const postActionRequest = App.request(App.action("GET /posts"))
    const postQueryRequest = App.request("Posts", {
      firstPost: App.query("postRandomOne", {
        select: {
          id: true,
          title: true,
        },
      }),
    })

    expect(FetcherUtils.isRequestAction(postActionRequest)).toBeTruthy()
    expect(FetcherUtils.isRequestAction(postQueryRequest)).toBeFalsy()
  })

  test("buildHeaders", async () => {
    const options = {
      clientId: "jest-test-fetcher",
      actionEndpoint: `http://localhost:${0}`,
    }

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
    const request = App.request(
      App.action("GET /posts-headers", {
        headers,
      }),
    )

    const builtHeaders = await FetcherUtils.buildHeaders(options, request.map)

    expect(builtHeaders.number).toEqual(headers.number)
    expect(builtHeaders.string).toEqual(headers.string)
    expect(builtHeaders.boolean).toEqual(headers.boolean)
    expect(builtHeaders.bigint).toEqual(headers.bigint)
    expect(builtHeaders.bigintObj).toEqual(headers.bigintObj)
    expect(builtHeaders.date).toEqual(headers.date.toISOString())
    expect(builtHeaders.dateTime).toEqual(headers.dateTime.toISOString())
    expect(builtHeaders.time).toEqual(headers.time.toISOString())
    expect(builtHeaders.float).toEqual(headers.float)
    expect(builtHeaders.object).toEqual(JSON.stringify(headers.object))
  })

  test("buildBody", async () => {
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
    const request = App.request(
      App.action("POST /post-body", {
        body,
      }),
    )

    const builtBody = FetcherUtils.buildBody(request.map)
    expect(builtBody).toEqual(JSON.stringify(body))
  })

  test("buildQueryString", async () => {
    const date = new Date(Date.UTC(2020, 1, 1, 1, 1, 1, 1))
    const query = {
      number: 1,
      string: "ASD12345",
      boolean: true,
      bigint: BigInt(900719925474099),
      bigintObj: BigInt(9007199254740991),
      date: date,
      dateTime: date,
      time: date,
      float: 2.5,
      object: {
        id: 1,
        name: "Admin",
      },
    }
    const request = App.request(
      App.action("GET /posts-query", {
        query,
      }),
    )
    const builtQS = FetcherUtils.buildQueryString(request.map)
    expect(builtQS).toBe(
      "?number=1&string=ASD12345&boolean=true&bigint=900719925474099&bigintObj=9007199254740991&date=2020-02-01T01%3A01%3A01.001Z&dateTime=2020-02-01T01%3A01%3A01.001Z&time=2020-02-01T01%3A01%3A01.001Z&float=2.5&object=%7B%22id%22%3A1%2C%22name%22%3A%22Admin%22%7D",
    )
  })

  test("buildParamsPath", async () => {
    const date = new Date(Date.UTC(2020, 1, 1, 1, 1, 1, 1))
    const params = {
      number: 1,
      string: "ASD12345",
      boolean: true,
      bigint: BigInt(900719925474099),
      bigintObj: BigInt(9007199254740991),
      date: date,
      dateTime: date,
      time: date,
      float: 2.5,
      object: {
        id: 1,
        name: "Admin",
      },
    }

    const request = App.request(
      App.action(
        "GET /posts-params/:number/:string/:boolean/:bigint/:bigintObj/:date/:dateTime/:time/:float/:object",
        {
          params,
        },
      ),
    )
    const builtParamsPath = FetcherUtils.buildParamsPath(request.map)
    expect(builtParamsPath).toBe(
      "/posts-params/1/ASD12345/true/900719925474099/9007199254740991/2020-02-01T01%3A01%3A01.001Z/2020-02-01T01%3A01%3A01.001Z/2020-02-01T01%3A01%3A01.001Z/2.5/%7B%22id%22%3A1%2C%22name%22%3A%22Admin%22%7D",
    )
  })

  test("extractQueryMetadata", async () => {
    const request = App.request("Posts", {
      firstPost: App.query("postRandomOne", {
        select: {
          id: true,
          title: true,
        },
      }),
    })
    const metadata = FetcherUtils.extractQueryMetadata(request)
    expect(metadata).toEqual({
      name: "Posts",
      body:
        "query Posts {\r\n  firstPost: postRandomOne {\r\n    id\r\n    title\r\n  }\r\n}\r\n",
    })

    const qqq = gql`
      query {
        firstPost: postRandomOne {
          id
          title
        }
      }
    `
    const metadata2 = FetcherUtils.extractQueryMetadata(qqq)
    expect(metadata2).toEqual({
      name: "",
      body:
        "\n" +
        "      query {\n" +
        "        firstPost: postRandomOne {\n" +
        "          id\n" +
        "          title\n" +
        "        }\n" +
        "      }\n" +
        "    ",
    })
  })

  test("requestToQuery", async () => {
    const request = App.request("Posts", {
      firstPost: App.query("postRandomOne", {
        select: {
          id: true,
          title: true,
        },
      }),
    })

    const query = FetcherUtils.requestToQuery(request)
    expect(query).toEqual(
      "query Posts {\r\n" +
        "  firstPost: postRandomOne {\r\n" +
        "    id\r\n" +
        "    title\r\n" +
        "  }\r\n" +
        "}\r\n",
    )
  })

  test("serializeInput", async () => {
    const input = {
      id: 1,
      title: "Post",
      text: "My first post.",
    }
    const serialized = FetcherUtils.serializeInput(input, 0)
    expect(serialized).toEqual(
      "  id: 1\r\n" + '  title: "Post"\r\n' + '  text: "My first post."\r\n',
    )
  })

  test("serializeSelect", async () => {
    const select = {
      id: true,
      title: true,
      text: true,
    }
    const serialized = FetcherUtils.serializeSelect(select, 0)
    expect(serialized).toEqual(
      "{\r\n" + "  id\r\n" + "  title\r\n" + "  text\r\n" + "}\r\n",
    )
  })
})
