import { DeclarationResolver, resolver } from "@microframework/core";
import { ModelResolver } from "@microframework/core";
import { ModelDLResolver } from "@microframework/core";
import { App } from "../app/App";
import { CategoryDeclaration } from "../declaration";
import { CategoryInput } from "../input"
import { Category } from "../model"
import { CategoryRepository } from "../repository"

export const CategoryQueryResolver = resolver(App, "category", async args => {
  const category = await CategoryRepository.findOne(args.id)
  return category ? category : null
})

// export const CategoryDeclarationResolver = resolver(App, {
//
//   async category(args: { id: number }) {
//     const category = await CategoryRepository.findOne(args.id)
//     return category ? category : null
//   },
//
//   async categorySave(args: CategoryInput): Promise<Category> {
//     return await CategoryRepository.save({
//       id: args.id,
//       name: args.name,
//     })
//   },
//
//   async categoryRemove(args: { id: number }): Promise<boolean> {
//     const category = await CategoryRepository.findOneOrFail(args.id)
//     await CategoryRepository.remove(category)
//     return true
//   }
//
// })

// export const CategoryDeclarationResolver: DeclarationResolver<CategoryDeclaration> = {
//
//   async category(args: { id: number }) {
//     const category = await CategoryRepository.findOne(2)
//     return category ? category : null
//   },
//
//   async categorySave(args: CategoryInput): Promise<Category> {
//     return await CategoryRepository.save({
//       id: args.id,
//       name: args.name,
//     })
//   },
//
//   async categoryRemove(args: { id: number }): Promise<boolean> {
//     const category = await CategoryRepository.findOneOrFail(args.id)
//     await CategoryRepository.remove(category)
//     return true
//   }
//
// }

// @resolver()
// export class AppDeclarationResolver implements DeclarationResolver<CategoryDeclaration> {
//
//   async category(args: { id: number }) {
//       const category = await CategoryRepository.findOne(args.id)
//       return category ? category : null
//   }
//
//   async categorySave(args: CategoryInput): Promise<Category> {
//     return await CategoryRepository.save({
//       id: args.id,
//       name: args.name,
//     })
//   }
//
//   async categoryRemove(args: { id: number }): Promise<boolean> {
//     const category = await CategoryRepository.findOneOrFail(args.id)
//     await CategoryRepository.remove(category)
//     return true
//   }
//
// }

// @resolver(App, "Category")
// export class CategoryModelResolver implements ModelResolver<Category> {
//
//   name() {
//     return "THIS IS SPARTA"
//   }
//
// }

// export const CategoryResolver1 = resolver(App, "Category", {
//
//   name() {
//     return "THIS IS SPARTA"
//   }
//
// })

// @resolver({ app: App, name: "Category", dataLoader: true })
// export class CategoryModelResolver implements ModelDLResolver<Category> {
//
//   name() {
//     return ["THIS IS SPARTA"]
//   }
//
// }

// export const CategoryResolver2 = resolver(App, { name: "Category", dataLoader: true }, () => ({
//   name() {
//     return ["nobody"]
//   }
// }))
