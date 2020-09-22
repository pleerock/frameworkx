import { promises as fs } from "fs"
import * as path from "path"
import { copyDirectory, replaceInFile } from "../util"

export async function initAction(
  name: string,
  directory: string,
  scale: "small" | "medium" | "large" | "monorepo" | "microservices",
) {
  // preparation
  const templatesPath = __dirname + "/../../../../templates" // todo: this is different in npm version of cli package
  const source = path.normalize(`${templatesPath}/${scale}-template`)
  const destination = directory
    ? process.cwd() + "/" + directory + "/" + name
    : process.cwd() + "/" + name

  // copy all template files
  console.log(`creating a new project at "${destination}"...`)
  await copyDirectory({
    source,
    destination: destination,
    filter: (filename: string) => {
      const allowedFiles = /.*(src\/*|\.env|\.gitignore\.template|package\.json|tsconfig\.json|README\.md)/g
      if (filename === source || allowedFiles.test(filename)) {
        return true
      }
      return false
    },
  })

  // rename a gitignore file to a git filename format
  await fs.rename(
    destination + "/.gitignore.template",
    destination + "/.gitignore",
  )

  // replace keywords in template files
  await replaceInFile(destination + "/package.json", {
    "microframework-template-small": name,
    "\\*": "~" + require("../../package.json").version,
  })

  console.log(`new project created`)
}
