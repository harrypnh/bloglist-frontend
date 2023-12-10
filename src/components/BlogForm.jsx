import { useState } from 'react'

const BlogForm = ({
  handleCreateBlog,
}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const createBlog = (event) => {
    event.preventDefault()
    handleCreateBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createBlog}>
        <div>
          <label>title:<input value={title} id='title' name='title' onChange={({ target }) => setTitle(target.value)}/></label>
        </div>
        <div>
          <label>author:<input value={author} id='author' name='author' onChange={({ target }) => setAuthor(target.value)}/></label>
        </div>
        <div>
          <label>url:<input value={url} id='url' name='url' onChange={({ target }) => setUrl(target.value)}/></label>
        </div>
        <button type='submit' id='create-button'>create</button>
      </form>
    </div>
  )
}

export default BlogForm