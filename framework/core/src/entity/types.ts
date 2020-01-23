import {EntitySchemaColumnOptions} from "typeorm";

// todo: we can also automatically show ManyToMany and OneToMany options for arrays and OneToOne and ManyToOne options for non arrays
export type EntitySchemaRelationOneOptions = {
  relation: "one-to-one"
  joinColumn: true
  inverseSide?: string
} | {
  relation: "one-to-one"
  joinColumn: false
  inverseSide: string
} | {
  relation: "many-to-one"
  inverseSide?: string
}

export type EntitySchemaRelationArrayOptions = {
  relation: "many-to-many"
  joinTable: false
  inverseSide: string
} | {
  relation: "many-to-many"
  joinTable: true
  inverseSide?: string
} | {
  relation: "one-to-many"
  inverseSide: string
}

// todo: we can also automatically show ManyToMany and OneToMany options for arrays and OneToOne and ManyToOne options for non arrays
export type EntitySchemaProperty<BlueprintProperty> =
  BlueprintProperty extends null ? never :
  BlueprintProperty extends undefined ? never :
  BlueprintProperty extends Array<infer I> | null | undefined ? (
    I extends null ? never :
    I extends undefined ? never :
    I extends object | undefined | null ? EntitySchemaRelationArrayOptions :
    EntitySchemaColumnOptions
  ) :
  BlueprintProperty extends object | null | undefined ? EntitySchemaRelationOneOptions :
  EntitySchemaColumnOptions


/**
 * Indicates if server must automatically resolve entity properties.
 * If set to true, resolves all properties.
 * Defaults to false.
 *
 * You can also specify list of particular properties you want to automatically resolve.
 */
export type EntityResolveSchema<Blueprint> = boolean | {
  [P in keyof Blueprint]?:
    Blueprint[P] extends null ? never :
    Blueprint[P] extends undefined ? never :
    Blueprint[P] extends object | undefined | null ? boolean :
    never
}

export type EntitySchema<Blueprint> = {
  [P in keyof Blueprint]?: EntitySchemaProperty<Blueprint[P]>
}
