import { ncp } from "ncp"
import { promises as fs } from "fs"
import mkdirp from "mkdirp"

/**
 * Copies all files from source directory into the given destination directory.
 */
export async function copyDirectory({
  source,
  destination,
  filter,
}: {
  source: string
  destination: string
  filter: RegExp | ((filename: string) => boolean)
}) {
  await mkdirp(destination)

  return new Promise((ok, fail) => {
    ncp(
      source,
      destination,
      {
        filter,
      },
      function (err) {
        if (err) {
          return fail(String(err))
        }
        ok()
      },
    )
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
