#!/usr/bin/env node
import { program } from "commander"
import { generateMetadataAction } from "./action/generateMetadataAction"
import { initAction } from "./action/initAction"

program.version(require("../package.json").version)

program
  .command("generate:metadata <destination>")
  .description("generates a metadata file from a given app .ts / .d.ts file")
  .action((destination: string) => generateMetadataAction(destination))

program
  .command("init <name>")
  .description("creates a boilerplate for a given project scale")
  .requiredOption(
    "-d, --destination <items>",
    "destination directory where project needs to be created",
  )
  .requiredOption(
    "-s, --scale <items>",
    "project scale",
    "small,medium,large,monorepo,microservices",
  )
  .action(
    (
      name: string,
      options: {
        destination: string
        scale: "small" | "medium" | "large" | "monorepo" | "microservices"
      },
    ) => initAction(name, options.destination, options.scale),
  )

program.parse(process.argv)
