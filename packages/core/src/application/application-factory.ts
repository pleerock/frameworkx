import {
  action,
  mutation,
  query,
  request,
  requestFn,
  subscription,
} from "../request"
import { Model } from "@microframework/model"
import { AnyValidationRule, validationRule } from "../validation"
import { AnyApplicationOptions } from "./application-helper-types"
import { AnyResolver, contextResolver, resolver } from "../resolver"
import { Application } from "./application-type"
import {
  ApplicationOptions,
  ForcedApplicationOptions,
} from "./application-options"

/**
 * Creates a new Application based on a given options.
 */
export function createApp<
  Options extends ApplicationOptions<any, any, any, any, any, any, any>
>(): Application<Options> {
  return {
    "@type": "Application",

    model(name) {
      return new Model(name as string)
    },

    input(name) {
      return new Model(name as string)
    },

    action(...args) {
      return (action as any)(this, ...args)
    },

    query(...args: any[]) {
      return (query as any)(this, ...args)
    },

    mutation(...args: any[]) {
      return (mutation as any)(this, ...args)
    },

    subscription(...args: any[]) {
      return (subscription as any)(this, ...args)
    },

    request(...args: any[]) {
      return (request as any)(...args)
    },

    requestFn(...args: any[]) {
      return (requestFn as any)(...args)
    },

    validationRule(...args: any[]): AnyValidationRule {
      return (validationRule as any)(this, ...args)
    },

    resolver(...args: any[]): AnyResolver {
      return (resolver as any)(this, ...args)
    },

    contextResolver(...args) {
      return (contextResolver as any)(this, ...args)
    },
  } as Application<Options>
}
