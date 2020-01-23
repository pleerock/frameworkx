import {app, PostFilterInput} from "@microframework/client-server-sample-common";
import {PostFromList} from "@microframework/client-server-sample-common";
import React, {useEffect, useState} from "react"
import {gql, loader} from 'graphql.macro'

// app.fetch("HTTP")
// app.graphql("") // query written as string or loaded from graphql file // todo: do we need it if we have aggregate
// app.

export const App = () => {

  const [postsCount, setPostsCount] = useState(0)
  const [editablePost, setEditablePost] = useState({
    name: "",
    description: "",
    likes: 0,
    authorId: 0,
  })

  const [posts, setPosts] = useState<PostFromList[]>([])

  const loadPostsUsingGraphQLFile = async () => {
      app
          .graphql
          .fetch<{ posts: PostFromList[] }>(loader("../query/PostsListQuery.graphql"))
          .then(({data}) => {
              console.log(data.posts.map(p => p.id))
              setPosts(posts)
          })
  }

  const loadPostsUsingQuery = async () => {
      const limit = 1
      app
          .graphql
          .fetch<{ posts: PostFromList[] }>(gql`
              query LoadPosts($limit: Int!) {
                  posts(limit: $limit, offset: 0) {
                      id
                      title
                  }
              }
          `, { limit })
          .then(({ data }) => {
              console.log(data.posts.map(p => p.id))
              setPosts(posts)
          })
  }

    const loadPosts = async () => {
        const filter: PostFilterInput = { limit: 5, offset: 0 }
        app
          .query("posts")
          .select("postFromList", filter, undefined)
          .then(posts => {
            // console.log(posts.map(p => p.))
            setPosts(posts)
          })

    // postsCountQuery({ name: "a" })
    //   .fetch()
    //   .then(count => setPostsCount(count))
  }

  const savePost = async () => {
    // postSaveQuery(editablePost)
    //   .fetch()
    //   .then(post => {
    //     console.log("post has been saved", post)

    //     loadPosts()
    //   })
  }

  const removePost = async (post: PostFromList) => {
    // postRemoveQuery(post.id)
    //   .fetch()
    //   .then(() => {
    //     console.log("post has been removed")

    //     loadPosts()
    //   })
  }

  useEffect(() => {
    loadPosts()
    loadPostsUsingQuery()
  }, [])

  return (
    <div>
      <div>Hello App (count: { postsCount })</div>
      <ul>
        { posts.map(post => (
          <li key={post.id}>{ post.id }) { post.title } <button onClick={() => removePost(post)}>delete</button></li>
        )) }
      </ul>

      <hr />
      <form>
        Name: <input onChange={event => (setEditablePost({ ...editablePost, name: event.target.value }))} value={editablePost.name} /><br/>
        Description: <input onChange={event => (setEditablePost({ ...editablePost, description: event.target.value }))} value={editablePost.description} /><br/>
        Likes: <input onChange={event => (setEditablePost({ ...editablePost, likes: parseInt(event.target.value) }))} value={editablePost.likes} /><br/>
        Author ID: <input onChange={event => (setEditablePost({ ...editablePost, authorId: parseInt(event.target.value) }))} value={editablePost.authorId} /><br/>
        <button type="button" onClick={() => savePost()}>save</button>
      </form>
    </div>
  )
}
