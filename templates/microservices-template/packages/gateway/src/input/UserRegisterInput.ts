/**
 * This input is used to register a new user.
 */
export type UserRegisterInput = {
  /**
   * User first name.
   */
  firstName: string

  /**
   * User last name.
   */
  lastName: string

  /**
   * User password in a plan format.
   */
  plainPassword: string
}
