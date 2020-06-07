import { AnyApplication } from "@microframework/core";
import { RateLimitNodeOptions } from "./RateLimitNodeOptions";

export type RateLimitOptions<App extends AnyApplication> = {
    actions?: {
        [P in keyof App["_options"]["actions"]]?: RateLimitNodeOptions
    }
    queries?: {
        [P in keyof App["_options"]["queries"]]?: RateLimitNodeOptions
    }
    mutations?: {
        [P in keyof App["_options"]["mutations"]]?: RateLimitNodeOptions
    }
    models?: {
        [P in keyof App["_options"]["models"]]?: {
            [MP in keyof App["_options"]["models"][P]]?: RateLimitNodeOptions
        }
    }
}