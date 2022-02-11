import { initAction } from "@microframework/cli/_/action/initAction"
import { promises as fs } from "fs"
import { scanFiles } from "@microframework/cli/_/util"

describe("cli > actions > init > microservices", () => {
  const source = "_/cli/microservices/app"
  let files: string[] = []

  beforeEach(async () => {
    await initAction("microservices-test", source, "microservices")
    files = await scanFiles(source, [])
  })

  afterEach(async () => {
    await fs.rmdir(source, { recursive: true })
  })

  test("contain all generated files", async () => {
    expect(files).toEqual([
      "_/cli/microservices/app/microservices-test/.gitignore",
      "_/cli/microservices/app/microservices-test/docker-compose.yml",
      "_/cli/microservices/app/microservices-test/lerna.json",
      "_/cli/microservices/app/microservices-test/package.json",
      "_/cli/microservices/app/microservices-test/packages/category/.env",
      "_/cli/microservices/app/microservices-test/packages/category/Dockerfile",
      "_/cli/microservices/app/microservices-test/packages/category/package.json",
      "_/cli/microservices/app/microservices-test/packages/category/src/app/CategoryApp.ts",
      "_/cli/microservices/app/microservices-test/packages/category/src/app/CategoryContext.ts",
      "_/cli/microservices/app/microservices-test/packages/category/src/app/CategoryDataSource.ts",
      "_/cli/microservices/app/microservices-test/packages/category/src/app/CategoryPubSub.ts",
      "_/cli/microservices/app/microservices-test/packages/category/src/app/CategoryServer.ts",
      "_/cli/microservices/app/microservices-test/packages/category/src/app/index.ts",
      "_/cli/microservices/app/microservices-test/packages/category/src/app/start.ts",
      "_/cli/microservices/app/microservices-test/packages/category/src/entity/CategoryEntity.ts",
      "_/cli/microservices/app/microservices-test/packages/category/src/entity/index.ts",
      "_/cli/microservices/app/microservices-test/packages/category/src/index.ts",
      "_/cli/microservices/app/microservices-test/packages/category/src/input/CategorySaveInput.ts",
      "_/cli/microservices/app/microservices-test/packages/category/src/input/index.ts",
      "_/cli/microservices/app/microservices-test/packages/category/src/model-resolver/CategoryModelResolver.ts",
      "_/cli/microservices/app/microservices-test/packages/category/src/model-resolver/index.ts",
      "_/cli/microservices/app/microservices-test/packages/category/src/model/Category.ts",
      "_/cli/microservices/app/microservices-test/packages/category/src/model/index.ts",
      "_/cli/microservices/app/microservices-test/packages/category/src/repository/CategoryRepository.ts",
      "_/cli/microservices/app/microservices-test/packages/category/src/repository/index.ts",
      "_/cli/microservices/app/microservices-test/packages/category/src/root-resolver/CategoryDeclarationResolver.ts",
      "_/cli/microservices/app/microservices-test/packages/category/src/root-resolver/CategoryQueryResolver.ts",
      "_/cli/microservices/app/microservices-test/packages/category/src/root-resolver/CategoryRemoveMutationResolver.ts",
      "_/cli/microservices/app/microservices-test/packages/category/src/root-resolver/CategorySaveMutationResolver.ts",
      "_/cli/microservices/app/microservices-test/packages/category/src/root-resolver/index.ts",
      "_/cli/microservices/app/microservices-test/packages/category/tsconfig.json",
      "_/cli/microservices/app/microservices-test/packages/gateway/.env",
      "_/cli/microservices/app/microservices-test/packages/gateway/Dockerfile",
      "_/cli/microservices/app/microservices-test/packages/gateway/package.json",
      "_/cli/microservices/app/microservices-test/packages/gateway/src/app/GatewayApp.ts",
      "_/cli/microservices/app/microservices-test/packages/gateway/src/app/GatewayServer.ts",
      "_/cli/microservices/app/microservices-test/packages/gateway/src/app/index.ts",
      "_/cli/microservices/app/microservices-test/packages/gateway/src/fetcher/CategoryFetcher.ts",
      "_/cli/microservices/app/microservices-test/packages/gateway/src/fetcher/index.ts",
      "_/cli/microservices/app/microservices-test/packages/gateway/src/fetcher/PostFetcher.ts",
      "_/cli/microservices/app/microservices-test/packages/gateway/src/fetcher/UserFetcher.ts",
      "_/cli/microservices/app/microservices-test/packages/gateway/src/index.ts",
      "_/cli/microservices/app/microservices-test/packages/gateway/src/input/CategorySaveInput.ts",
      "_/cli/microservices/app/microservices-test/packages/gateway/src/input/index.ts",
      "_/cli/microservices/app/microservices-test/packages/gateway/src/input/PostSaveInput.ts",
      "_/cli/microservices/app/microservices-test/packages/gateway/src/input/UserRegisterInput.ts",
      "_/cli/microservices/app/microservices-test/packages/gateway/src/model-resolver/CategoryModelResolver.ts",
      "_/cli/microservices/app/microservices-test/packages/gateway/src/model-resolver/index.ts",
      "_/cli/microservices/app/microservices-test/packages/gateway/src/model-resolver/PostModelResolver.ts",
      "_/cli/microservices/app/microservices-test/packages/gateway/src/model-resolver/UserModelResolver.ts",
      "_/cli/microservices/app/microservices-test/packages/gateway/src/model/Category.ts",
      "_/cli/microservices/app/microservices-test/packages/gateway/src/model/index.ts",
      "_/cli/microservices/app/microservices-test/packages/gateway/src/model/Post.ts",
      "_/cli/microservices/app/microservices-test/packages/gateway/src/model/User.ts",
      "_/cli/microservices/app/microservices-test/packages/gateway/src/root-resolver/CategoryResolver.ts",
      "_/cli/microservices/app/microservices-test/packages/gateway/src/root-resolver/index.ts",
      "_/cli/microservices/app/microservices-test/packages/gateway/src/root-resolver/PostResolver.ts",
      "_/cli/microservices/app/microservices-test/packages/gateway/src/root-resolver/UserResolver.ts",
      "_/cli/microservices/app/microservices-test/packages/gateway/tsconfig.json",
      "_/cli/microservices/app/microservices-test/packages/post/.env",
      "_/cli/microservices/app/microservices-test/packages/post/Dockerfile",
      "_/cli/microservices/app/microservices-test/packages/post/package.json",
      "_/cli/microservices/app/microservices-test/packages/post/src/app/index.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/app/PostApp.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/app/PostContext.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/app/PostDataSource.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/app/PostPubSub.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/app/PostServer.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/app/start.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/entity/index.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/entity/PostEntity.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/index.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/input/index.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/input/PostFilterInput.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/input/PostSaveInput.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/model-resolver/index.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/model-resolver/PostModelResolver.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/model/index.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/model/Post.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/repository/index.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/repository/PostRepository.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/root-resolver/index.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/root-resolver/PostCreatedSubscriptionResolver.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/root-resolver/PostRemoveMutationResolver.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/root-resolver/PostSaveMutationResolver.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/root-resolver/PostsQueryResolver.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/validator/index.ts",
      "_/cli/microservices/app/microservices-test/packages/post/src/validator/PostValidationRule.ts",
      "_/cli/microservices/app/microservices-test/packages/post/tsconfig.json",
      "_/cli/microservices/app/microservices-test/packages/user/.env",
      "_/cli/microservices/app/microservices-test/packages/user/Dockerfile",
      "_/cli/microservices/app/microservices-test/packages/user/package.json",
      "_/cli/microservices/app/microservices-test/packages/user/src/app/index.ts",
      "_/cli/microservices/app/microservices-test/packages/user/src/app/start.ts",
      "_/cli/microservices/app/microservices-test/packages/user/src/app/UserApp.ts",
      "_/cli/microservices/app/microservices-test/packages/user/src/app/UserContext.ts",
      "_/cli/microservices/app/microservices-test/packages/user/src/app/UserDataSource.ts",
      "_/cli/microservices/app/microservices-test/packages/user/src/app/UserPubSub.ts",
      "_/cli/microservices/app/microservices-test/packages/user/src/app/UserServer.ts",
      "_/cli/microservices/app/microservices-test/packages/user/src/entity/index.ts",
      "_/cli/microservices/app/microservices-test/packages/user/src/entity/UserEntity.ts",
      "_/cli/microservices/app/microservices-test/packages/user/src/index.ts",
      "_/cli/microservices/app/microservices-test/packages/user/src/input/index.ts",
      "_/cli/microservices/app/microservices-test/packages/user/src/input/UserRegisterInput.ts",
      "_/cli/microservices/app/microservices-test/packages/user/src/model-resolver/index.ts",
      "_/cli/microservices/app/microservices-test/packages/user/src/model-resolver/UserModelResolver.ts",
      "_/cli/microservices/app/microservices-test/packages/user/src/model/index.ts",
      "_/cli/microservices/app/microservices-test/packages/user/src/model/User.ts",
      "_/cli/microservices/app/microservices-test/packages/user/src/repository/index.ts",
      "_/cli/microservices/app/microservices-test/packages/user/src/repository/UserRepository.ts",
      "_/cli/microservices/app/microservices-test/packages/user/src/root-resolver/index.ts",
      "_/cli/microservices/app/microservices-test/packages/user/src/root-resolver/UserRegisterMutationResolver.ts",
      "_/cli/microservices/app/microservices-test/packages/user/src/root-resolver/UsersQueryResolver.ts",
      "_/cli/microservices/app/microservices-test/packages/user/src/util/index.ts",
      "_/cli/microservices/app/microservices-test/packages/user/src/util/PasswordEncryptor.ts",
      "_/cli/microservices/app/microservices-test/packages/user/tsconfig.json",
      "_/cli/microservices/app/microservices-test/README.md",
      "_/cli/microservices/app/microservices-test/tsconfig.json",
    ])
  })

  test("generated files should have replaced imports", async () => {
    for (let file of files) {
      const loadedFile = await fs.readFile(file, "utf8")

      expect(
        loadedFile.indexOf(`from "microframework-template-microservices-post"`),
      ).toBe(-1)
      expect(
        loadedFile.indexOf(
          `from "microframework-template-microservices-category"`,
        ),
      ).toBe(-1)
      expect(
        loadedFile.indexOf(`from "microframework-template-microservices-user"`),
      ).toBe(-1)
      expect(
        loadedFile.indexOf(`from "microframework-template-microservices-root"`),
      ).toBe(-1)
      expect(
        loadedFile.indexOf(
          `from "microframework-template-microservices-gateway"`,
        ),
      ).toBe(-1)
    }
  })
})
