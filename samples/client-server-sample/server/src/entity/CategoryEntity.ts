import "@microframework/core";
import { CategoryType } from "@microframework/client-server-sample-common";
import { entity } from "@microframework/core";

export const CategoryEntity = entity<CategoryType>("CategoryType").schema({
    id: {
      type: "int",
      primary: true,
      generated: "increment"
    },
    name: {
      type: "varchar"
    },
    posts: {
      relation: "many-to-many" as const,
      joinTable: false,
      inverseSide: "categories"
    }
  })
