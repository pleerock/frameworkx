#!/usr/bin/env node
import fs from "fs"
import * as path from "path"
import { parse } from "@microframework/parser"
import { program } from "commander"

program.version(require("../package.json").version)

program
  .command("generate:metadata <destination>")
  .description("generates a metadata file from a given app .ts / .d.ts file")
  .action((destination: string) => {
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
  })

program.parse(process.argv)
