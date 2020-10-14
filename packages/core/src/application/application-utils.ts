import { MixedList } from "../application"

/**
 * Set of utility functions for the Application.
 */
export const ApplicationUtils = {
  /**
   * Converts MixedList<T> to strictly an array of its T items.
   */
  mixedListToArray<T>(list: MixedList<T>): T[] {
    if (typeof list === "object") {
      return Object.keys(list).map((key) => (list as { [key: string]: T })[key])
    } else {
      return list
    }
  },
}
