export type PostType = {
  id: number
  title: string
  status: StatusType
}

export enum StatusType {
  DRAFT = "DRAFT",
  ON_MODERATION = "ON_MODERATION",
  PUBLISHED = "PUBLISHED",
}
