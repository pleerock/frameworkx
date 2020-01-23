import {Model} from "@microframework/core";

export type User = {
  id: number,
  firstName: string,
  lastName: string,
}

export type UserModel = Model<User>