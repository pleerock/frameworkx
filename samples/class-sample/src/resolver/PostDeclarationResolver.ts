import { DeclarationResolver } from "@microframework/core"
import { PostDeclaration } from "../declaration/PostDeclaration"
import { PostFilterInput } from "../input/PostFilterInput"
import { PostInput } from "../input/PostInput"
import { PostType } from "../model/Post"
import { PostRepository } from "../repository/PostRepository"

export class PostDeclarationResolver
  implements DeclarationResolver<PostDeclaration> {
  async posts(args: PostFilterInput): Promise<PostType[]> {
    return PostRepository.findAllPosts()
  }

  async postRemove(args: { id: number }): Promise<boolean> {
    const post = await PostRepository.findOneOrFail(args.id)
    await PostRepository.remove(post)
    return true
  }

  postSave(args: PostInput): Promise<PostType> {
    return PostRepository.findOneOrFail(args.id!)
  }
}
