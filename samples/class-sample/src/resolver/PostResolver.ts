import { ModelResolver } from "@microframework/core"
import { ResolverReturnValue } from "@microframework/core";
import { Model } from "@microframework/model";
import { AppModels } from "../app/AppModels";
import { Category } from "../model";

export function modelResolver<T>(
    name: string | Model<T>,
    resolver: ModelResolver<T>
) {

}

type V1 = ResolverReturnValue<Category["posts"]>
type V2 = ResolverReturnValue<Category["name"]>

export const PostTypeResolver = modelResolver(AppModels.Category, {


    // status() {
    //     return PostStatus.under_moderation
    // }

})

// class PostTypeResolverCls implements MixedModelResolver<Category> {
//     name() {
//         return ""
//     }
// }

const PostTypeResolverCls: ModelResolver<Category> = {



}
