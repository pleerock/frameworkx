import { Request, Response } from "express"

export type ActionEvent = {
    method: string
    route: string
    request: Request
    response: Response
}