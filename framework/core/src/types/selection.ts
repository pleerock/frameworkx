import {Action, ActionType, DeclarationItem, DeclarationItemArgs, Model, ModelList, SelectionList} from "../app";
import {ApplicationClient} from "../client";
import {DeclarationSelector, ModelSelector} from "../selection";
import {SubscriptionSelector} from "../selection/SubscriptionSelector";
import {
    BlueprintCondition,
    BlueprintOrdering,
    SelectionSchema
} from "./core";

// export type DeclarationSelectionSelect<T> =
//   T extends Model<infer B> ? SelectionSchema<B> :
//   T extends ModelReference<infer M> ? SelectionSchema<M["blueprint"]> :
//   T extends BlueprintArray<infer I> ?
//     I extends Model<infer B> ? SelectionSchema<B> :
//     I extends ModelReference<infer M> ? SelectionSchema<M["blueprint"]> :
//     I extends Blueprint ? SelectionSchema<I> :
//     never :
//   T extends BlueprintNullable<infer V> ? (
//     V extends Model<infer B> ? SelectionSchema<B> :
//     V extends ModelReference<infer M> ? SelectionSchema<M["blueprint"]> :
//     V extends BlueprintArray<infer I> ?
//       I extends Model<infer B> ? SelectionSchema<B> :
//       I extends ModelReference<infer M> ? SelectionSchema<M["blueprint"]> :
//       I extends Blueprint ? SelectionSchema<I> :
//       never :
//     V extends Blueprint ? SelectionSchema<V> :
//     never
//   ) :
//   T extends Blueprint ? SelectionSchema<T> :
//   never

// export type SelectionOf<T extends Model<any, any>, SelectionSchema> = {
//     [P in keyof T]?: boolean
// }

// /**
//  * Returns all properties for selection from a given selection object.
//  */
type SelectionSelectedKeys<S extends SelectionSchema<any>> = { [P in keyof S]: S[P] extends false ? never : P }[keyof S]

// /**
//  * Returns all selected keys in the blueprint based on a given selection object.
//  */
type BlueprintSelectedKeys<Blueprint, S> = Pick<Blueprint, { [P in keyof Blueprint]: P extends SelectionSelectedKeys<S> ? P : never }[keyof Blueprint]>

export type SelectionsFiltered<Selections extends SelectionList, Value> = { 
  [P in keyof Selections]: Selections[P]["model"] extends Value ? P : never 
}[keyof Selections];


export type ModelSelections<Declaration extends DeclarationItem, Selections extends SelectionList> =
Declaration extends (args: infer Args) => infer Return ?
  Return extends Array<infer I> ? { [P in SelectionsFiltered<Selections, I>]: Selections[P] } :
  { [P in SelectionsFiltered<Selections, Return>]: Selections[P] }
: unknown

export type DeclarationSelectionResult<Declaration extends DeclarationItem, Selection> =
    Declaration extends (args: infer Args) => infer Return ?
      Return extends Array<infer I> ? (
        Selection[]
      ) :
      Selection
    : unknown
    // Declaration extends (args: infer Args) => infer Return ?
    //   Return extends Model<infer Blueprint, any> ? Blueprint :
    //   Return extends Array<infer I> ? (
    //     I extends Model<infer Blueprint, any> ? Blueprint[] :
    //     I[]
    //   ) :
    //   Return
    // : unknown



export type SelectionArgs<T extends Model<any, any>, Selection> =
    T extends { args: infer Args, blueprint: infer Blueprint } ? /*AnyBlueprintSelectionType<*/Blueprint/*, Selection["select"]>*/ :
    T extends { blueprint: infer Blueprint } ? /*AnyBlueprintSelectionType<*/Blueprint/*, Selection["select"]>*/ :
    unknown

export type DeclarationSelectionArgsA<T extends Model<any, any>> = {
    [P in keyof T["blueprint"]]?: T["args"] extends DeclarationItemArgs<T["blueprint"]> ? T["args"][P] : never
}

export type DeclarationSelectionArgs<Declaration extends DeclarationItem> =
    Declaration extends (args: infer Args) => infer Return ?
        Return extends Model<any, any> ? Return["args"] : undefined
    : undefined

export type DeclarationArgs<Declaration extends DeclarationItem> =
    Declaration extends (args: infer Args) => infer Return ? Args :
    Declaration extends () => infer Return ? undefined :
    undefined

/**
 * Selection subset of the particular model / blueprint with args applied if they are defined.
 */
export type DeclarationSelection<T extends DeclarationItem | Model<any, any>, EntitySelection extends boolean = false> =
  T extends (args: infer Args) => infer Return ?
    {
      select: SelectionSchema<Return>,
      args: Args
    } :
  T extends () => infer Return ?
    {
      select: SelectionSchema<Return>,
    } :
  T extends { blueprint: infer Blueprint, args: infer Args } ?
    {
      select: SelectionSchema<Blueprint>,
      args: Args
    } :
  T extends { blueprint: infer Blueprint } ? (
      EntitySelection extends true ?
      {
          select: SelectionSchema<Blueprint>,
          args?: {
              where?: BlueprintCondition<Blueprint>
              order?: BlueprintOrdering<Blueprint>
              limit?: number
              offset?: number
          }
      } :
      {
          select: SelectionSchema<Blueprint>,
      }
  )
  : unknown

/**
 * Defines a type of the selected value.
 */
export type DeclarationSelectorResult<
  Declaration extends DeclarationItem | Model<any, any>,
  Selection extends DeclarationSelection<Declaration, any>
> =
    // todo: its broken right now, implement!!!
    Declaration extends ((args: infer Args) => infer Return) ? /*AnyBlueprintSelectionType<*/Return/*, Selection["select"]>*/ :
    Declaration extends (() => infer Return) ? /*AnyBlueprintSelectionType<*/Return/*, Selection["select"]>*/ :
    Declaration extends { args: infer Args, blueprint: infer Blueprint } ? /*AnyBlueprintSelectionType<*/Blueprint/*, Selection["select"]>*/ :
    Declaration extends { blueprint: infer Blueprint } ? /*AnyBlueprintSelectionType<*/Blueprint/*, Selection["select"]>*/ :
    never


export type SelectorSelectionType<T> =
  T extends DeclarationSelector<infer Declaration, infer Selection> ? DeclarationSelectorResult<Declaration, Selection> :
  T extends ModelSelector<infer Model, infer Context, infer Selection, infer ReturnType> ? ReturnType :
  T extends SubscriptionSelector<infer Declaration, infer Selection> ? DeclarationSelectorResult<Declaration, Selection> :
  unknown

export type SelectionType<T> = T extends (...args: any) => any ? SelectorSelectionType<ReturnType<T>> : SelectorSelectionType<T>

const transformArgs = (args: any): string => {
  return Object
    .keys(args)
    .filter(argsKey => args[argsKey] !== undefined)
    .map(argsKey => {
      if (args[argsKey] instanceof Object) {
        return `${argsKey}: { ${transformArgs(args[argsKey])} }`
      } else if (typeof args[argsKey] === "string") {
        return `${argsKey}: "${args[argsKey]}"`
      } else {
        return `${argsKey}: ${args[argsKey]}`
      }
    })
    .join(", ")
}

export const SelectToQueryStringTransformer = {
  transform(select: any) {
    let query = `{`
    for (let key in select) {
      if (select[key] === undefined)
        continue

      if (select[key] === true) {
        query += ` ${key}`
        
      } else if (select[key] instanceof Object) {
        query += ` ${key}`
        if ((select[key] as { args: any }).args) {
          query += `(`
          query += transformArgs((select[key] as { args: any }).args)
          query += ")"
        }
        if ((select[key] as { select: any }).select) {
          query += " " + this.transform(select[key].select) + " "
        }
      }
    }
    query += " }"
    return query
  }
}

export function executeAction(
  client: ApplicationClient | undefined,
  route: string,
  type: string,
  actionValues: ActionType<Action> | unknown,
) {
  if (!client)
    throw new Error(`Client was not set, cannot perform fetch. Configure your app using app.setupClient(defaultClient({ ... })) first.`)

  return client.action(route, type, actionValues)
}

// todo: add args
export function executeQuery(
  client: ApplicationClient | undefined,
  type: "query" | "mutation",
  name: string,
  selectionName: string,
  options: any,
) {

  // console.log(options)

    if (!client)
      throw new Error(`Client was not set, cannot perform fetch. Configure your app using app.setupClient(defaultClient({ ... })) first.`)

    let query = ""
    if (type === "query") {
      query += `query `
    } else if (type === "mutation") {
      query += `mutation `
    }
    // if (args) {
    //   query += `(${JSON.stringify(args)})`
    // }
    query += `{ ${name}`
    if (options.args) {
      query += `(`
      query += transformArgs(options.args)
      query += ")"
    }
    query += " " + SelectToQueryStringTransformer.transform(options.select)
    query += " }"
    // console.log("query: ", query)
    return client
      .graphql(JSON.stringify({ query }))
      .then(response => {
        // todo: make this code more elegant
        if (response.errors && response.errors.length) {
          throw new Error(response.errors)
        }
        return response.data[name]
      })
}
