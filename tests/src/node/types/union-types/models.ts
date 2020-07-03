export type PostType = {
  id: number
  title: string
  author: UserType | OrganizationType
}

export type UserType = {
  id: string
  firstName: string
  lastName: string
}

export type OrganizationType = {
  id: string
  name: string
}
