import {Status} from "../enum/Status";

/**
 * Dummy User type.
 */
export type UserType = {

    /**
     * Category id.
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
     * User status.
     */
    status: Status

    /**
     * User activation status.
     */
    activation: "activated" | "inProgress"
}
