import { lstatSync, promises as fs } from "fs"
import mkdirp from "mkdirp"
import { glob } from "glob"

/**
 * Lists all files from a given directory but excludes given files.
 */
export function scanFiles(source: string, ignore: string[]) {
  return new Promise<string[]>((ok, fail) => {
    glob(
      source + "/**/*",
      {
        dot: true,
        ignore,
      },
      function (err, matches) {
        if (err) return fail(err)
        ok(matches)
      },
    )
  })
}

/**
 * Copies all files from source directory into the given destination directory.
 */
export async function copyFiles({
  source,
  files,
  destination,
}: {
  source: string
  files: string[]
  destination: string
}) {
  await mkdirp(destination)

  return new Promise<string[]>(async (ok, fail) => {
    try {
      const copiedFiles: string[] = []
      for (let file of files) {
        const dest = destination + file.replace(source, "")
        if (lstatSync(file).isDirectory()) {
          await mkdirp(dest)
        } else {
          await fs.copyFile(file, dest)
          copiedFiles.push(dest)
        }
      }
      ok(copiedFiles)
    } catch (e) {
      fail(e)
    }
  })
}

/**
 * Replaces given strings in a given file.
 */
export async function replaceInFile(
  filepath: string,
  replaceMap: {
    [key: string]: string
  },
) {
  let data = await fs.readFile(filepath, "utf8")
  for (let toBeReplaced in replaceMap) {
    const replaceWith = replaceMap[toBeReplaced]
    data = data.replace(new RegExp(toBeReplaced, "g"), replaceWith)
  }
  await fs.writeFile(filepath, data, "utf8")
}
