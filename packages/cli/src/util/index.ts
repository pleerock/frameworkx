import { lstatSync, promises as fs } from "fs"
import { glob } from "glob"
import path from "path"

/**
 * Lists all files from a given directory but excludes given files.
 */
export function scanFiles(source: string, ignore: string[]): Promise<string[]> {
  return new Promise<string[]>((ok, fail) => {
    try {
      glob(
        source + "/**/*",
        {
          dot: true,
          nodir: true,
          ignore,
        },
        function (err, matches) {
          if (err) return fail(err)
          ok(matches)
        },
      )
    } catch (err) {
      fail(err)
    }
  })
}

/**
 * Copies all files from source directory into the given destination directory.
 * Returns all copied file paths.
 */
export async function copyFiles({
  basedir,
  files,
  destination,
}: {
  basedir: string
  files: string[]
  destination: string
}): Promise<string[]> {
  await fs.mkdir(destination, { recursive: true })

  return new Promise<string[]>(async (ok, fail) => {
    try {
      const copiedFiles: string[] = []
      for (let file of files) {
        if (lstatSync(file).isDirectory()) continue
        const dest = destination + file.replace(basedir, "")
        const fileDir = path.dirname(dest)
        if (fileDir) {
          await fs.mkdir(fileDir, { recursive: true })
        }
        await fs.copyFile(file, dest)
        copiedFiles.push(dest)
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
