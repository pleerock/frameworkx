import { service } from "@microframework/core"

export const CarFactory = service(
  class {
    build() {
      return [
        { id: 1, name: "Model X" },
        { id: 2, name: "Model Y" },
        { id: 3, name: "Model Z" },
      ]
    }
  },
)
