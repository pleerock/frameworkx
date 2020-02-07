import {ContextList} from "../../application";

export type ValidateModelFn<Blueprint, Context extends ContextList> = (
    obj: Blueprint,
    context: Context
) => void | Promise<void>
