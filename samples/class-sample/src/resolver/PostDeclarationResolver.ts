import { DeclarationResolver } from "@microframework/core"
import { PostDeclaration } from "../declaration"
import { PostFilterInput, PostInput } from "../input"
import { Post } from "../model"
import { PostRepository } from "../repository"

export const PostDeclarationResolver: DeclarationResolver<PostDeclaration> = {
  async posts(args: PostFilterInput): Promise<Post[]> {
    return PostRepository.findAllPosts()
  },

  async postRemove(args: { id: number }): Promise<boolean> {
    const post = await PostRepository.findOneOrFail(args.id)
    await PostRepository.remove(post)
    return true
  },

  postSave(args: PostInput): Promise<Post> {
    return PostRepository.findOneOrFail(args.id!)
  }
}

// export const posts = resolveQuery("posts", (args: PostFilterInput) => {
//
// })
//
// export const PostModel = resolveModel("posts", {
//
// })
