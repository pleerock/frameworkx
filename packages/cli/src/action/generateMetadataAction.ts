import * as fs from "fs"
import * as path from "path"
import { parse } from "@microframework/parser"

/**
 * Generates application metadata in a .json format out of declaration defined in a TypeScript code file.
 */
export function generateMetadataAction(appFilePath: string) {
  const dir =
    appFilePath.substr(0, 1) === "/"
      ? appFilePath
      : path.normalize(process.cwd() + "/" + appFilePath)
  const tsFilePath = path.normalize(dir + ".ts")
  const dtsFilePath = path.normalize(dir + ".d.ts")
  const newFilePath = dir + ".json"

  // parse metadata from a given file, depend what extension we find in a given path
  let metadata: object
  if (fs.existsSync(tsFilePath)) {
    console.log(`Parsing "${tsFilePath}"`)
    metadata = parse(tsFilePath)
  } else if (fs.existsSync(dtsFilePath)) {
    console.log(`Parsing "${dtsFilePath}"`)
    metadata = parse(dtsFilePath)
  } else {
    throw new Error(
      `"${tsFilePath}" nor "${dtsFilePath}" were found, please make sure to specify correct application file, without it's extension.`,
    )
  }

  // write a metadata into the file
  fs.writeFileSync(newFilePath, JSON.stringify(metadata))

  console.log(`A new "${newFilePath}" file with metadata was generated.`)
}
