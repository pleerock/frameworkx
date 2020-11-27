import * as fs from "fs"
import * as path from "path"
import { parse } from "@microframework/parser"

export function generateMetadataAction(appFilePath: string) {
  const dir =
    appFilePath.substr(0, 1) === "/"
      ? appFilePath
      : path.normalize(process.cwd() + "/" + appFilePath)
  const tsFilePath = path.normalize(dir + ".ts")
  const dtsFilePath = path.normalize(dir + ".d.ts")
  const newFilePath = dir + ".json"

  if (fs.existsSync(tsFilePath)) {
    console.log(`Parsing "${tsFilePath}"`)
    const metadata = parse(tsFilePath)
    fs.writeFileSync(newFilePath, JSON.stringify(metadata))
  } else if (fs.existsSync(dtsFilePath)) {
    console.log(`Parsing "${dtsFilePath}"`)
    const metadata = parse(dtsFilePath)
    fs.writeFileSync(newFilePath, JSON.stringify(metadata))
  } else {
    throw new Error(
      `"${tsFilePath}" nor "${dtsFilePath}" were found, please make sure to specify correct application file, without it's extension.`,
    )
  }

  console.log(`A new "${newFilePath}" file with metadata was generated.`)
}
