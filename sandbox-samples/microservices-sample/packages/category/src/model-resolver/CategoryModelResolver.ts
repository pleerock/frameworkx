import { CategoryApp } from "../app"

/**
 * Resolver for Category model.
 */
export const CategoryModelResolver = CategoryApp.resolver(
  CategoryApp.model("Category"),
  {
    // ... resolve model properties...
  },
)
