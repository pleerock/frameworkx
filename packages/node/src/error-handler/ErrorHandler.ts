import { ActionEvent } from "../action/ActionEvent"
import { ResolveLogErrorInfo } from "../LoggingHelper"

/**
 * Error handling interface.
 */
export type ErrorHandler = {

  actionError(options: ActionEvent & { error: any }): void

  resolverError(options: ResolveLogErrorInfo): void

}
