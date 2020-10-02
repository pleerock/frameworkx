import { PostSaveInput } from "microframework-template-monorepo-common"
import React, { useEffect, useState } from "react"
import { fetcher } from "./fetcher"
import "./App.css"

function App() {
  const [newPost, setNewPost] = useState<PostSaveInput>({
    title: "",
    categoryIds: [],
  })

  const [posts, setPosts] = useState<
    {
      id: number
      title: string
      text: string | null
    }[]
  >([])

  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    const { data } = await fetcher
      .query("PostsQuery")
      .add("posts")
      .posts({ take: 5, skip: 0 })
      .select({
        id: true,
        title: true,
        text: true,
      })
      .fetch()

    setPosts(data.posts)
  }

  async function savePost() {
    await fetcher
      .mutation("PostSaveMutation")
      .add("post")
      .postSave(newPost)
      .select({
        id: true,
      })
      .fetch()

    loadPosts()
    alert("post saved!")
  }

  async function deletePost(id: number) {
    await fetcher
      .mutation("PostRemoveMutation")
      .add("result")
      .postRemove({ id })
      .fetch()

    loadPosts()
    alert("post removed!")
  }

  return (
    <div className="App">
      <header className="App-header">
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h4>
                {post.title}{" "}
                <a href="#" onClick={() => deletePost(post.id)}>
                  [x]
                </a>
              </h4>
              <p>{post.text}</p>
            </li>
          ))}
        </ul>

        <div>
          <h5>Create a new post:</h5>
          <label>title:</label>
          <input
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <br />
          <label>text:</label>
          <input
            value={newPost.text || ""}
            onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
          />
          <br />
          <button onClick={(e) => savePost()}>create</button>
        </div>
      </header>
    </div>
  )
}

export default App
