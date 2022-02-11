import { initAction } from "@microframework/cli/_/action/initAction"
import { promises as fs } from "fs"
import { scanFiles } from "@microframework/cli/_/util"

describe("cli > actions > init > monolith", () => {
  const source = "_/cli/monolith/app"
  let files: string[] = []

  beforeEach(async () => {
    await initAction("monolith-test", source, "monolith")
    files = await scanFiles(source, [])
  })

  afterEach(async () => {
    await fs.rmdir(source, { recursive: true })
  })

  test("contain all generated files", async () => {
    expect(files).toEqual([
      "_/cli/monolith/app/monolith-test/.env",
      "_/cli/monolith/app/monolith-test/.gitignore",
      "_/cli/monolith/app/monolith-test/package.json",
      "_/cli/monolith/app/monolith-test/README.md",
      "_/cli/monolith/app/monolith-test/src/app/App.ts",
      "_/cli/monolith/app/monolith-test/src/app/AppDataSource.ts",
      "_/cli/monolith/app/monolith-test/src/app/AppContext.ts",
      "_/cli/monolith/app/monolith-test/src/app/AppPubSub.ts",
      "_/cli/monolith/app/monolith-test/src/app/AppServer.ts",
      "_/cli/monolith/app/monolith-test/src/app/index.ts",
      "_/cli/monolith/app/monolith-test/src/entity/CategoryEntity.ts",
      "_/cli/monolith/app/monolith-test/src/entity/index.ts",
      "_/cli/monolith/app/monolith-test/src/entity/PostEntity.ts",
      "_/cli/monolith/app/monolith-test/src/index.ts",
      "_/cli/monolith/app/monolith-test/src/input/CategorySaveInput.ts",
      "_/cli/monolith/app/monolith-test/src/input/index.ts",
      "_/cli/monolith/app/monolith-test/src/input/PostFilterInput.ts",
      "_/cli/monolith/app/monolith-test/src/input/PostSaveInput.ts",
      "_/cli/monolith/app/monolith-test/src/model-resolver/CategoryModelResolver.ts",
      "_/cli/monolith/app/monolith-test/src/model-resolver/index.ts",
      "_/cli/monolith/app/monolith-test/src/model-resolver/PostModelResolver.ts",
      "_/cli/monolith/app/monolith-test/src/model/Category.ts",
      "_/cli/monolith/app/monolith-test/src/model/index.ts",
      "_/cli/monolith/app/monolith-test/src/model/Post.ts",
      "_/cli/monolith/app/monolith-test/src/repository/CategoryRepository.ts",
      "_/cli/monolith/app/monolith-test/src/repository/index.ts",
      "_/cli/monolith/app/monolith-test/src/repository/PostRepository.ts",
      "_/cli/monolith/app/monolith-test/src/root-resolver/CategoryDeclarationResolver.ts",
      "_/cli/monolith/app/monolith-test/src/root-resolver/index.ts",
      "_/cli/monolith/app/monolith-test/src/root-resolver/PostDeclarationResolver.ts",
      "_/cli/monolith/app/monolith-test/src/validator/index.ts",
      "_/cli/monolith/app/monolith-test/src/validator/PostValidationRule.ts",
      "_/cli/monolith/app/monolith-test/tsconfig.json",
    ])
  })
})
