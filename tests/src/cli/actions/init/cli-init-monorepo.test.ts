import { initAction } from "@microframework/cli/_/action/initAction"
import { promises as fs } from "fs"
import { scanFiles } from "@microframework/cli/_/util"

describe("cli > actions > init > monorepo", () => {
  const source = "_/cli/monorepo/app"
  let files: string[] = []

  beforeEach(async () => {
    await initAction("monorepo-test", source, "monorepo")
    files = await scanFiles(source, [])
  })

  afterEach(async () => {
    await fs.rmdir(source, { recursive: true })
  })

  test("contain all generated files", async () => {
    expect(files).toEqual([
      "_/cli/monorepo/app/monorepo-test/.gitignore",
      "_/cli/monorepo/app/monorepo-test/lerna.json",
      "_/cli/monorepo/app/monorepo-test/package.json",
      "_/cli/monorepo/app/monorepo-test/packages/client/.gitignore",
      "_/cli/monorepo/app/monorepo-test/packages/client/package.json",
      "_/cli/monorepo/app/monorepo-test/packages/client/public/favicon.ico",
      "_/cli/monorepo/app/monorepo-test/packages/client/public/index.html",
      "_/cli/monorepo/app/monorepo-test/packages/client/public/logo192.png",
      "_/cli/monorepo/app/monorepo-test/packages/client/public/logo512.png",
      "_/cli/monorepo/app/monorepo-test/packages/client/public/manifest.json",
      "_/cli/monorepo/app/monorepo-test/packages/client/public/robots.txt",
      "_/cli/monorepo/app/monorepo-test/packages/client/README.md",
      "_/cli/monorepo/app/monorepo-test/packages/client/src/App.css",
      "_/cli/monorepo/app/monorepo-test/packages/client/src/App.test.tsx",
      "_/cli/monorepo/app/monorepo-test/packages/client/src/App.tsx",
      "_/cli/monorepo/app/monorepo-test/packages/client/src/fetcher.ts",
      "_/cli/monorepo/app/monorepo-test/packages/client/src/index.css",
      "_/cli/monorepo/app/monorepo-test/packages/client/src/index.tsx",
      "_/cli/monorepo/app/monorepo-test/packages/client/src/logo.svg",
      "_/cli/monorepo/app/monorepo-test/packages/client/src/react-app-env.d.ts",
      "_/cli/monorepo/app/monorepo-test/packages/client/src/serviceWorker.ts",
      "_/cli/monorepo/app/monorepo-test/packages/client/src/setupTests.ts",
      "_/cli/monorepo/app/monorepo-test/packages/client/tsconfig.json",
      "_/cli/monorepo/app/monorepo-test/packages/common/package.json",
      "_/cli/monorepo/app/monorepo-test/packages/common/src/app.ts",
      "_/cli/monorepo/app/monorepo-test/packages/common/src/index.ts",
      "_/cli/monorepo/app/monorepo-test/packages/common/src/input/CategorySaveInput.ts",
      "_/cli/monorepo/app/monorepo-test/packages/common/src/input/index.ts",
      "_/cli/monorepo/app/monorepo-test/packages/common/src/input/PostFilterInput.ts",
      "_/cli/monorepo/app/monorepo-test/packages/common/src/input/PostSaveInput.ts",
      "_/cli/monorepo/app/monorepo-test/packages/common/src/model/Category.ts",
      "_/cli/monorepo/app/monorepo-test/packages/common/src/model/index.ts",
      "_/cli/monorepo/app/monorepo-test/packages/common/src/model/Post.ts",
      "_/cli/monorepo/app/monorepo-test/packages/common/tsconfig.json",
      "_/cli/monorepo/app/monorepo-test/packages/server/.env",
      "_/cli/monorepo/app/monorepo-test/packages/server/package.json",
      "_/cli/monorepo/app/monorepo-test/packages/server/src/app/AppConnection.ts",
      "_/cli/monorepo/app/monorepo-test/packages/server/src/app/AppContext.ts",
      "_/cli/monorepo/app/monorepo-test/packages/server/src/app/AppPubSub.ts",
      "_/cli/monorepo/app/monorepo-test/packages/server/src/app/AppServer.ts",
      "_/cli/monorepo/app/monorepo-test/packages/server/src/app/index.ts",
      "_/cli/monorepo/app/monorepo-test/packages/server/src/entity/CategoryEntity.ts",
      "_/cli/monorepo/app/monorepo-test/packages/server/src/entity/index.ts",
      "_/cli/monorepo/app/monorepo-test/packages/server/src/entity/PostEntity.ts",
      "_/cli/monorepo/app/monorepo-test/packages/server/src/index.ts",
      "_/cli/monorepo/app/monorepo-test/packages/server/src/model-resolver/CategoryModelResolver.ts",
      "_/cli/monorepo/app/monorepo-test/packages/server/src/model-resolver/index.ts",
      "_/cli/monorepo/app/monorepo-test/packages/server/src/model-resolver/PostModelResolver.ts",
      "_/cli/monorepo/app/monorepo-test/packages/server/src/repository/CategoryRepository.ts",
      "_/cli/monorepo/app/monorepo-test/packages/server/src/repository/index.ts",
      "_/cli/monorepo/app/monorepo-test/packages/server/src/repository/PostRepository.ts",
      "_/cli/monorepo/app/monorepo-test/packages/server/src/root-resolver/CategoryDeclarationResolver.ts",
      "_/cli/monorepo/app/monorepo-test/packages/server/src/root-resolver/index.ts",
      "_/cli/monorepo/app/monorepo-test/packages/server/src/root-resolver/PostDeclarationResolver.ts",
      "_/cli/monorepo/app/monorepo-test/packages/server/src/validator/index.ts",
      "_/cli/monorepo/app/monorepo-test/packages/server/src/validator/PostValidationRule.ts",
      "_/cli/monorepo/app/monorepo-test/packages/server/tsconfig.json",
      "_/cli/monorepo/app/monorepo-test/README.md",
      "_/cli/monorepo/app/monorepo-test/tsconfig.json",
    ])
  })

  test("generated files should have replaced imports", async () => {
    for (let file of files) {
      const loadedFile = await fs.readFile(file, "utf8")

      expect(
        loadedFile.indexOf(`from "microframework-template-monorepo-root"`),
      ).toBe(-1)
      expect(
        loadedFile.indexOf(`from "microframework-template-monorepo-common"`),
      ).toBe(-1)
      expect(
        loadedFile.indexOf(`from "microframework-template-monorepo-client"`),
      ).toBe(-1)
      expect(
        loadedFile.indexOf(`from "microframework-template-monorepo-server"`),
      ).toBe(-1)
    }
  })
})
