import * as fs from "fs"
import * as path from "path"
import { parse } from "@microframework/parser"

export function generateMetadataAction(destination: string) {
  const dir = process.cwd() + "/" + destination
  const tsFilePath = path.normalize(dir + ".ts")
  const dtsFilePath = path.normalize(dir + ".d.ts")

  if (fs.existsSync(tsFilePath)) {
    console.log(`Parsing "${tsFilePath}"`)
    const metadata = parse(tsFilePath)
    fs.writeFileSync(dir + ".json", JSON.stringify(metadata))
  } else if (fs.existsSync(dtsFilePath)) {
    console.log(`Parsing "${dtsFilePath}"`)
    const metadata = parse(dtsFilePath)
    fs.writeFileSync(dir + ".json", JSON.stringify(metadata))
  } else {
    throw new Error(
      `"${tsFilePath}" nor "${dtsFilePath}" were found, please make sure to specify correct application file, without it's extension.`,
    )
  }
}
