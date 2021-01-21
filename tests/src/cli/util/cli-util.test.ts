import { copyFiles, replaceInFile, scanFiles } from "@microframework/cli/_/util"
import path from "path"
import { promises as fs } from "fs"

describe("cli > util", () => {
  const basedir = path.resolve(__dirname + "/../../../")

  test("scanFiles", async () => {
    const files = await scanFiles("src/cli", [
      "**/node_modules/**",
      "**/util/**.test.ts",
    ])

    expect(files).toEqual([
      "src/cli/actions/init/cli-init-microservices.test.ts",
      "src/cli/actions/init/cli-init-monolith.test.ts",
      "src/cli/actions/init/cli-init-monorepo.test.ts",
    ])
  })
  test("copyFiles", async () => {
    // remove all files before copying
    const randomDir = "temp" + Math.floor(Math.random() * 10000)
    await fs.rmdir(`${basedir}/_/${randomDir}/copied`, { recursive: true })

    // copy all files
    const copiedFiles = await copyFiles({
      basedir: basedir,
      files: [
        basedir + "/src/cli/actions/init/cli-init-microservices.test.ts",
        basedir + "/src/cli/actions/init/cli-init-monolith.test.ts",
        basedir + "/src/cli/actions/init/cli-init-monorepo.test.ts",
        basedir + "/src/cli/util/cli-util.test.ts",
      ],
      destination: `${basedir}/_/${randomDir}/copied`,
    })
    expect(copiedFiles).toEqual([
      `${basedir}/_/${randomDir}/copied/src/cli/actions/init/cli-init-microservices.test.ts`,
      `${basedir}/_/${randomDir}/copied/src/cli/actions/init/cli-init-monolith.test.ts`,
      `${basedir}/_/${randomDir}/copied/src/cli/actions/init/cli-init-monorepo.test.ts`,
      `${basedir}/_/${randomDir}/copied/src/cli/util/cli-util.test.ts`,
    ])

    // use scan files to make sure files actually in there
    const files = await scanFiles(`_/${randomDir}/copied`, [])
    expect(files).toEqual([
      `_/${randomDir}/copied/src/cli/actions/init/cli-init-microservices.test.ts`,
      `_/${randomDir}/copied/src/cli/actions/init/cli-init-monolith.test.ts`,
      `_/${randomDir}/copied/src/cli/actions/init/cli-init-monorepo.test.ts`,
      `_/${randomDir}/copied/src/cli/util/cli-util.test.ts`,
    ])
  })
  test("replaceInFile", async () => {
    // copy this file
    const randomDir = "temp" + Math.floor(Math.random() * 10000)
    const [copiedFile] = await copyFiles({
      basedir: basedir,
      files: [basedir + "/src/cli/util/cli-util.test.ts"],
      destination: `${basedir}/_/${randomDir}/copied`,
    })

    console.log(copiedFile)

    // replace test name
    await replaceInFile(copiedFile, {
      'describe\\(\\"cli \\> util\\",': 'describe("cli tests > util",',
      'test\\(\\"replaceInFile\\",': 'test("Replace In File",',
    })

    // load the file and make sure new words are included
    const copiedFileContent = await fs.readFile(copiedFile, {
      encoding: "utf-8",
    })
    expect(copiedFileContent).toContain('describe("cli tests > util",')
    expect(copiedFileContent).toContain('test("Replace In File",')
  })
})
