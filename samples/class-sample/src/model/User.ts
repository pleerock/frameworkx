/**
 * Dummy User type.
 */
export type User = {
  /**
   * User id.
   */
  id: number

  /**
   * User's first name.
   */
  firstName: string

  /**
   * User's last name.
   */
  lastName: string

  /**
   * User's full name.
   */
  fullName: string

  /**
   * User's activity status.
   */
  status: "inactive" | "active"
}
