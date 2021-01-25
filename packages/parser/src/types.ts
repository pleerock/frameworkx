import * as ts from "typescript"

export type ParserContext = {
  program: ts.Program
  typeNames: string[]
  appFileName: string
}
