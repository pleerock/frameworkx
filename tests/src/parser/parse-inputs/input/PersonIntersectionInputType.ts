/**
 * This way we are testing intersection type.
 */
export type PersonIntersectionInputType =
    { id: number, name: string } &
    { aboutMe: string, photoUrl: string } &
    PersonEducationType &
    PersonCareerInterface &
    PersonSkillClass

/**
 * Part of Person - education information.
 */
export type PersonEducationType = {
    degree: string
    graduated: boolean
}

/**
 * Part of Person - career information.
 */
export interface PersonCareerInterface {
    workingPlace: string
    seekingForJob: boolean
}

/**
 * Part of Person - skill information.
 */
export class PersonSkillClass {
    english!: boolean
    tajik!: boolean
}
