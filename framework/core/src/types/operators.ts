import {SelectionSchema} from "./core";

// export class BlueprintOperator {
//
// }

// export class BlueprintNullable<Type extends BlueprintPrimitiveProperty | Blueprint | BlueprintArray<any> | Model<any> | ModelReference<any> | BlueprintSelection<any, any> | InputBlueprint | InputReference<any> | Input<any> | BlueprintArray<BlueprintPrimitiveProperty | InputBlueprint | Input<any> | InputReference<any>>> extends BlueprintOperator {
//   instanceof: "BlueprintNullable" = "BlueprintNullable"
//   constructor(public option: Type) {
//     super()
//   }
// }
//
// export function nullable<Type extends BlueprintPrimitiveProperty | Blueprint | BlueprintArray<any> | Model<any> | ModelReference<any> | InputBlueprint | InputReference<any> | Input<any> | BlueprintArray<BlueprintPrimitiveProperty | InputBlueprint | Input<any> | InputReference<any>>>(option: Type) {
//   return new BlueprintNullable(option)
// }
//
// export class BlueprintNullable<Type extends BlueprintPrimitiveProperty | Blueprint | BlueprintArray<any> | Model<any> | BlueprintSelection<any, any>> extends BlueprintOperator {
//   instanceof: "BlueprintNullable" = "BlueprintNullable"
//   constructor(public option: Type) {
//     super()
//   }
// }
//
// export function nullable<Type extends BlueprintPrimitiveProperty | Blueprint | BlueprintArray<any> | Model<any>>(option: Type) {
//   return new BlueprintNullable(option)
// }

// export class NullableInput<Type extends BlueprintPrimitiveProperty | InputBlueprint | InputReference<any> | Input<any> | InputArray<any>> extends BlueprintOperator {
//   instanceof: "NullableInput" = "NullableInput"
//   constructor(public option: Type) {
//     super()
//   }
// }
//
// export function nullableInput<Type extends BlueprintPrimitiveProperty | InputBlueprint | InputReference<any> | Input<any> | InputArray<any>>(option: Type) {
//   return new NullableInput(option)
// }

// export class BlueprintArray<Type extends BlueprintPrimitiveProperty | Blueprint | Model<any> | ModelReference<any> | BlueprintSelection<any, any> | InputBlueprint | Input<any> | InputReference<any>> extends BlueprintOperator {
//   instanceof: "BlueprintArray" = "BlueprintArray"
//   constructor(public option: Type) {
//     super()
//   }
// }
//
// export function array<Type extends BlueprintPrimitiveProperty | Blueprint | Model<any> | ModelReference<any> | BlueprintSelection<any, any> | InputBlueprint | Input<any> | InputReference<any>>(option: Type) {
//   return new BlueprintArray(option)
// }

// export class InputArray<Type extends BlueprintPrimitiveProperty | InputBlueprint | Input<any> | InputReference<any>> extends BlueprintOperator {
//   instanceof: "InputArray" = "InputArray"
//   constructor(public option: Type) {
//     super()
//   }
// }
//
// export function inputArray<Type extends BlueprintPrimitiveProperty | InputBlueprint | Input<any> | Input<any> | InputReference<any>>(option: Type) {
//   return new InputArray(option)
// }

// export class BlueprintArgs<
//   ValueType extends BlueprintPrimitiveProperty | Blueprint | Model<any> | ModelReference<any> | BlueprintArray<any> | BlueprintSelection<any, any> | BlueprintNullable<any>,
//   ArgsType extends InputBlueprint | Input<any> | InputReference<any>
//   > extends BlueprintOperator {
//   instanceof: "BlueprintArgs" = "BlueprintArgs"
//   constructor(public valueType: ValueType, public argsType: ArgsType) {
//     super()
//   }
// }

// export function args<
//   ValueType extends BlueprintPrimitiveProperty | Blueprint | Model<any> | ModelReference<any> | BlueprintArray<any> | BlueprintSelection<any, any> | BlueprintNullable<any>,
//   ArgsType extends InputBlueprint | Input<any> | InputReference<any>
//   >(
//   valueType: ValueType,
//   argsType: ArgsType
// ) {
//   return new BlueprintArgs(valueType, argsType)
// }


// export class Model<Blueprint, Args> {
//   instanceof: "Model" = "Model"
//   blueprint!: Blueprint
//   args!: Args
//   constructor(public name: string) {
//   }
// }
//
// export function model<Blueprint, Args>(name: string) {
//   return new Model<Blueprint, Args>(name)
// }

// export class Declaration<Blueprint, Args> {
//   instanceof: "Declaration" = "Declaration"
//   blueprint!: Blueprint
//   args!: Args
//   constructor(public type: "query" | "mutation") {
//   }
// }
//
// export function query<Blueprint, Args>() {
//   return new Declaration<Blueprint, Args>("query")
// }
//
// export function mutation<Blueprint, Args>() {
//   return new Declaration<Blueprint, Args>("mutation")
// }
//
// export class Action<Blueprint, Args> {
//   instanceof: "Declaration" = "Declaration"
//   blueprint!: Blueprint
//   args!: Args
//   constructor(public name: string) {
//   }
// }
//
// export function action<Blueprint, Args>(method: string) {
//   return new Action<Blueprint, Args>(method)
// }

// export class ModelReference<T extends Model<any>> extends BlueprintOperator {
//   instanceof: "ModelReference" = "ModelReference"
//   blueprint!: T
//   constructor(public name: string) {
//     super()
//   }
// }

// export function reference<T extends Model<any>>(name: string) {
//   return new ModelReference<T>(name)
// }

// export class Input<Blueprint> {
//   instanceof: "Input" = "Input"
//   blueprint!: Blueprint
//   constructor(public name: string) {
//   }
// }
//
// export function input<Blueprint>(name: string) {
//   return new Input(name)
// }

// export class InputReference<T extends Input<any>> extends BlueprintOperator {
//   instanceof: "InputReference" = "InputReference"
//   blueprint!: T
//   constructor(public name: string) {
//     super()
//   }
// }
//
// export function inputReference<T extends Input<any>>(name: string) {
//   return new InputReference<T>(name)
// }


// export class BlueprintSelection<Blueprint, S extends SelectionSchema<Blueprint>> {
//   instanceof: "Selection" = "Selection"
//   constructor(public blueprint: Model<Blueprint, any>, public schema?: S) {
//   }
// }
//
// export function selection<Blueprint, S extends SelectionSchema<Blueprint>>(blueprint: Model<Blueprint, any>, schema?: S) {
//   return new BlueprintSelection<Blueprint, S>(blueprint, schema)
// }

export class Float {
  instanceof: "Float" = "Float"
  static instanceof: "Float" = "Float"
}

export interface FloatConstructor {
  new(value?: any): Float;
  readonly prototype: Float;
}
