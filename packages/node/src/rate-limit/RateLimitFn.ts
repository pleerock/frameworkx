import { AnyApplication, ResolveKey } from "@microframework/core";
import { RateLimitOptions } from "./RateLimitOptions";

export function rateLimits<
    App extends AnyApplication,
    Key extends ResolveKey<App["_options"]>,
>(
    app: App,
    options: RateLimitOptions<App>,
): RateLimitOptions<App> {
    return options
}