#!/usr/bin/env node
import { program } from "commander"
import { generateMetadataAction } from "./action/generateMetadataAction"
import { initAction } from "./action/initAction"

program.version(require("../package.json").version)

program
  .command("generate:metadata <appFilePath>")
  .description("generates a metadata file from a given app .ts / .d.ts file")
  .action((appFilePath: string) => generateMetadataAction(appFilePath))

program
  .command("init <name>")
  .description("creates a boilerplate for a given project scale")
  .option(
    "-d, --destination <items>",
    "destination directory where project needs to be created",
    "",
  )
  .option("-t, --type <items>", "project type", "monolith")
  .action(
    (
      name: string,
      options: {
        destination: string
        type: "monolith" | "monorepo" | "microservices"
      },
    ) => initAction(name, options.destination, options.type),
  )

program.parse(process.argv)
