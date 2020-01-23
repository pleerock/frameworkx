import {AnyApplicationOptions, Application} from "./index";

export function createApp<Options extends AnyApplicationOptions>() { // todo: meaningless
  return new Application<Options>()
}
