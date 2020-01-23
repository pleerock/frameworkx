export type Model<T> = { blueprint: T }

export type User = {
    id: number,
    firstName: string,
    lastName: string,
}

export type UserModel = Model<User>

// export type Models = UserModel