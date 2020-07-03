import { DateTime, Time } from "@microframework/core"

export type PostType = {
  id: number
  title: string
  lastDate: Date
  lastTime: Time
  createdAt: DateTime
}
