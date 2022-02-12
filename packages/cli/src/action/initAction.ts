import { existsSync, promises as fs } from "fs"
import * as path from "path"
import { copyFiles, replaceInFile, scanFiles } from "../util"

/**
 * Initializes a boilerplate project.
 */
export async function initAction(
  name: string,
  directory: string,
  scale: "monolith" | "monorepo" | "microservices",
) {
  // make sure project scale properly setup
  if (
    scale !== "monolith" &&
    scale !== "monorepo" &&
    scale !== "microservices"
  ) {
    throw new Error(
      `Project type can only be one of the following values: "monolith", "monorepo", "microservices".`,
    )
  }

  // make sure templates are inside CLI package
  if (!existsSync(__dirname + "/../../templates")) {
    throw new Error(
      `Templates are missing in the project, cannot complete operation.`,
    )
  }

  // preparation
  // templatePath can be different in published version and local development version
  const templatesPath = __dirname + "/../../templates"
  const source = path.normalize(`${templatesPath}/${scale}-template`)
  const destination = directory
    ? process.cwd() + "/" + directory + "/" + name
    : process.cwd() + "/" + name
  const frameworkVersion = require("../../package.json").version

  const files = await scanFiles(source, [])
  // [
  //   "**/_/**",
  //   "**/node_modules/**",
  //   "**/tsconfig.tsbuildinfo",
  //   "**/package-lock.json",
  //   "**/tsconfig.json",
  // ]

  // copy all template files
  console.log(`creating a new project at "${destination}"...`)

  if (scale === "monolith") {
    await copyFiles({
      basedir: source,
      files,
      destination: destination,
    })

    // rename some files
    await fs.rename(
      destination + "/.gitignore.template",
      destination + "/.gitignore",
    )
    await fs.rename(
      destination + "/tsconfig.json.template",
      destination + "/tsconfig.json",
    )

    // replace keywords in template files
    await replaceInFile(destination + "/package.json", {
      "microframework-template-monolith": name,
      "\\*": "~" + require("../../package.json").version,
    })
  } else if (scale === "monorepo") {
    const copiedFiles = await copyFiles({
      basedir: source,
      files,
      destination,
    })

    // replace all imports in the copied files
    for (let file of copiedFiles) {
      await replaceInFile(file, {
        'from "microframework-template-monorepo-common"': `from "@${name}/common"`,
      })
    }

    const frameworkDepsReplaceMap = {
      '"\\@microframework\\/(.*)": "\\*"': `"@microframework/$1": "~${frameworkVersion}"`,
      "microframework-template-monorepo-root": `@${name}/root`,
      "microframework-template-monorepo-common": `@${name}/common`,
      "microframework-template-monorepo-client": `@${name}/client`,
      "microframework-template-monorepo-server": `@${name}/server`,
    }

    // replace keywords in template files
    await replaceInFile(destination + "/package.json", frameworkDepsReplaceMap)
    await replaceInFile(
      destination + "/packages/common/package.json",
      frameworkDepsReplaceMap,
    )
    await replaceInFile(
      destination + "/packages/client/package.json",
      frameworkDepsReplaceMap,
    )
    await replaceInFile(
      destination + "/packages/server/package.json",
      frameworkDepsReplaceMap,
    )

    await replaceInFile(destination + "/packages/server/src/app/AppServer.ts", {
      "../../node_modules/microframework-template-monorepo-common": `../../node_modules/@${name}/common`,
    })

    // rename some files
    await fs.rename(
      destination + "/.gitignore.template",
      destination + "/.gitignore",
    )
    await fs.rename(
      destination + "/tsconfig.json.template",
      destination + "/tsconfig.json",
    )
    await fs.rename(
      destination + "/packages/client/tsconfig.json.template",
      destination + "/packages/client/tsconfig.json",
    )
    await fs.rename(
      destination + "/packages/client/.gitignore.template",
      destination + "/packages/client/.gitignore",
    )
    await fs.rename(
      destination + "/packages/common/tsconfig.json.template",
      destination + "/packages/common/tsconfig.json",
    )
    await fs.rename(
      destination + "/packages/server/tsconfig.json.template",
      destination + "/packages/server/tsconfig.json",
    )
  } else if (scale === "microservices") {
    const copiedFiles = await copyFiles({
      basedir: source,
      files,
      destination,
    })

    // replace all imports in the copied files
    for (let file of copiedFiles) {
      await replaceInFile(file, {
        'from "microframework-template-microservices-post"': `from "@${name}/post"`,
        'from "microframework-template-microservices-category"': `from "@${name}/category"`,
        'from "microframework-template-microservices-user"': `from "@${name}/user"`,
      })
    }

    const frameworkDepsReplaceMap = {
      '"\\@microframework\\/(.*)": "\\*"': `"@microframework/$1": "~${frameworkVersion}"`,
      "microframework-template-microservices-root": `@${name}/root`,
      "microframework-template-microservices-gateway": `@${name}/gateway`,
      "microframework-template-microservices-post": `@${name}/post`,
      "microframework-template-microservices-category": `@${name}/category`,
      "microframework-template-microservices-user": `@${name}/user`,
    }

    // replace keywords in template files
    await replaceInFile(destination + "/package.json", frameworkDepsReplaceMap)
    await replaceInFile(
      destination + "/packages/gateway/package.json",
      frameworkDepsReplaceMap,
    )
    await replaceInFile(
      destination + "/packages/category/package.json",
      frameworkDepsReplaceMap,
    )
    await replaceInFile(
      destination + "/packages/post/package.json",
      frameworkDepsReplaceMap,
    )
    await replaceInFile(
      destination + "/packages/user/package.json",
      frameworkDepsReplaceMap,
    )

    // rename some files
    await fs.rename(
      destination + "/.gitignore.template",
      destination + "/.gitignore",
    )
    await fs.rename(
      destination + "/tsconfig.json.template",
      destination + "/tsconfig.json",
    )
    await fs.rename(
      destination + "/packages/gateway/tsconfig.json.template",
      destination + "/packages/gateway/tsconfig.json",
    )
    await fs.rename(
      destination + "/packages/category/tsconfig.json.template",
      destination + "/packages/category/tsconfig.json",
    )
    await fs.rename(
      destination + "/packages/post/tsconfig.json.template",
      destination + "/packages/post/tsconfig.json",
    )
    await fs.rename(
      destination + "/packages/user/tsconfig.json.template",
      destination + "/packages/user/tsconfig.json",
    )
  }

  console.log(`New project successfully created`)
}
