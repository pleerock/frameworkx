import {NumberValidationConstraints, StringValidationConstraints} from "..";
import {ContextList} from "../../app";

// export type PropertyValidatorFn<Parent extends Blueprint | InputBlueprint, T extends AnyBlueprint | AnyRootInput, Context extends ContextList> =
//   T extends BlueprintPrimitiveProperty ? (value: AnyBlueprintType<T>, parent: (Parent extends Blueprint ? AnyBlueprintType<Parent> : Parent extends InputBlueprint ? AnyInputType<Parent> : unknown), context: AnyBlueprintType<Context>) => AnyBlueprintType<T> | Promise<AnyBlueprintType<T> | undefined> | undefined :
//   T extends BlueprintArray<any> ? (value: AnyBlueprintType<T>, parent: (Parent extends Blueprint ? AnyBlueprintType<Parent> : Parent extends InputBlueprint ? AnyInputType<Parent> : unknown), context: AnyBlueprintType<Context>) => AnyBlueprintType<T> | Promise<AnyBlueprintType<T> | undefined> | undefined :
//   T extends BlueprintNullable<BlueprintPrimitiveProperty | Blueprint | BlueprintArray<any> | Model<any> | BlueprintSelection<any, any>> ? (value: AnyBlueprintType<T>, parent: (Parent extends Blueprint ? AnyBlueprintType<Parent> : Parent extends InputBlueprint ? AnyInputType<Parent> : unknown), context: AnyBlueprintType<Context>) => AnyBlueprintType<T> | Promise<AnyBlueprintType<T> | undefined> | undefined :
//   // T extends BlueprintNullable<InputBlueprint | InputReference<any> | Input<any>> ? (value: AnyInputType<T,  parent: (Parent extends Blueprint ? AnyBlueprintType<PP> : Parent extends InputBlueprint ? AnyInputType<PP> : unknown),context: AnyBlueprintType<Context>>) => AnyBlueprintType<T> | Promise<AnyBlueprintType<T | undefined> | undefined :
//   T extends BlueprintSelection<any, any> ? (value: AnyBlueprintType<T>, parent: (Parent extends Blueprint ? AnyBlueprintType<Parent> : Parent extends InputBlueprint ? AnyInputType<Parent> : unknown), context: AnyBlueprintType<Context>) => AnyBlueprintType<T> | Promise<AnyBlueprintType<T> | undefined> | undefined :
//   T extends BlueprintArgs<any, any> ? (value: AnyBlueprintType<T>, parent: (Parent extends Blueprint ? AnyBlueprintType<Parent> : Parent extends InputBlueprint ? AnyInputType<Parent> : unknown), context: AnyBlueprintType<Context>) => AnyBlueprintType<T> | Promise<AnyBlueprintType<T> | undefined> | undefined :
//   T extends Model<any> ? (value: AnyBlueprintType<T>, parent: (Parent extends Blueprint ? AnyBlueprintType<Parent> : Parent extends InputBlueprint ? AnyInputType<Parent> : unknown), context: AnyBlueprintType<Context>) => AnyBlueprintType<T> | Promise<AnyBlueprintType<T> | undefined> | undefined :
//   T extends ModelReference<any> ? (value: AnyBlueprintType<T>, parent: (Parent extends Blueprint ? AnyBlueprintType<Parent> : Parent extends InputBlueprint ? AnyInputType<Parent> : unknown), context: AnyBlueprintType<Context>) => AnyBlueprintType<T> | Promise<AnyBlueprintType<T> | undefined> | undefined :
//   T extends Input<any> ? (value: AnyInputType<T>, parent: (Parent extends Blueprint ? AnyBlueprintType<Parent> : Parent extends InputBlueprint ? AnyInputType<Parent> : unknown), context: AnyBlueprintType<Context>) => AnyInputType<T> | Promise<AnyInputType<T> | undefined> | undefined :
//   T extends InputReference<any> ? (value: AnyInputType<T>, parent: (Parent extends Blueprint ? AnyBlueprintType<Parent> : Parent extends InputBlueprint ? AnyInputType<Parent> : unknown), context: AnyBlueprintType<Context>) => AnyInputType<T> | Promise<AnyInputType<T> | undefined> | undefined :
//   T extends Blueprint ? (value: AnyBlueprintType<T>, parent: (Parent extends Blueprint ? AnyBlueprintType<Parent> : Parent extends InputBlueprint ? AnyInputType<Parent> : unknown), context: AnyBlueprintType<Context>) => AnyBlueprintType<T> | Promise<AnyBlueprintType<T> | undefined> | undefined :
//   T extends InputBlueprint ? (value: AnyInputType<T>, parent: (Parent extends Blueprint ? AnyBlueprintType<Parent> : Parent extends InputBlueprint ? AnyInputType<Parent> : unknown), context: AnyBlueprintType<Context>) => AnyInputType<T> | Promise<AnyInputType<T> | undefined> | undefined :
//   never

/**
 * Validation schema for a Blueprint of the model or input.
 */
export type ValidationSchema<Blueprint, Context extends ContextList> = {
  [P in keyof Blueprint]?:
    (
        (value: Blueprint[P], parent: Blueprint, context: Context) => Blueprint[P] | Promise<Blueprint[P] | undefined> | undefined
        // PropertyValidatorFn<T, T[P], Context>
    )
        |
    (
      Blueprint[P] extends null ? never :
      Blueprint[P] extends undefined ? never :
      Blueprint[P] extends Array<infer I> | null | undefined ? (
        I extends string | null | undefined ? StringValidationConstraints :
        I extends number ? NumberValidationConstraints :
        // I extends FloatConstructor ? NumberValidationConstraints :
        never
      ) :
      Blueprint[P] extends string | null | undefined ? StringValidationConstraints :
      Blueprint[P] extends number | null | undefined ? NumberValidationConstraints :
      // Blueprint[P] extends Float ? NumberValidationConstraints :
      never
    )
}
