import {ContextList} from "../../app";

export type ValidateModelFn<Blueprint, Context extends ContextList> = (
    obj: Blueprint,
    context: Context
) => void | Promise<void>

export type ValidateInputFn<Blueprint, Context extends ContextList> = (
    obj: Blueprint,
    context: Context
) => void | Promise<void>
