import { ListOfType } from "../application"

/**
 * Converts ListOfType<T> type of object into array of T items.
 */
export function listOfTypeToArray<T>(list: ListOfType<T>): T[] {
  if (typeof list === "object") {
    return Object.keys(list).map((key) => (list as { [key: string]: T })[key])
  } else {
    return list
  }
}
