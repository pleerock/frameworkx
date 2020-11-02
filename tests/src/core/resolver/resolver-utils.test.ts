import { ResolverUtils } from "@microframework/core"

describe("core > resolver > utils", () => {
  test("normalizeResolverMetadatas", () => {
    expect(ResolverUtils.normalizeResolverMetadatas([])).toEqual({
      "@type": "TypeMetadata",
      kind: "number",
      description: "type about a number",
      array: false,
      nullable: false,
      canBeUndefined: false,
      properties: [],
    })
  })
})
