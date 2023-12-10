import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'

const Notification = ({ message }) => {
  if (message.content === null) {
    return null
  }
  else if (message.error) {
    return (
      <div className='error'>
        {message.content}
      </div>
    )
  }
  else {
    return (
      <div className='success'>
        {message.content}
      </div>
    )
  }
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState({
    content: null,
    error: false
  })
  const [blogFormVisible, setBlogFormVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBloglistappUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage({ content: 'wrong username or password', error: true })
      setTimeout(() => {
        setMessage({ content: null, error: false })
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBloglistappUser')
    setUser(null)
  }

  const handleCreateBlog = async ({
    title,
    author,
    url
  }) => {
    const blogObject = {
      title: title,
      author: author,
      url: url
    }
    const response = await blogService.create(blogObject)
    if (response.status === 201) {
      const newBlog = response.data
      newBlog.user = user
      setBlogs(blogs.concat(newBlog))
      setMessage({ content: `a new blog ${newBlog.title} by ${newBlog.author} added`, error: false })
      setTimeout(() => {
        setMessage({ content: null, error: false })
      }, 5000)
    }
    else {
      setMessage({ content: `failed to add a new blog ${blogObject.title} by ${blogObject.author}`, error: true })
      setTimeout(() => {
        setMessage({ content: null, error: false })
      }, 5000)
    }
  }

  const handleBlogLike = async (blogObject) => {
    blogObject.likes += 1
    const blogUser = blogObject.user
    blogObject.user = blogObject.user.id
    const updatedBlog = await blogService.update(blogObject)
    updatedBlog.user = blogUser
    setBlogs(blogs
      .filter(blog => blog.id !== updatedBlog.id)
      .concat(updatedBlog)
      .sort((a, b) => b.likes - a.likes)
    )
  }

  const handleRemoveBlog = async (blogObject) => {
    const confirm = window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)
    if (!confirm) {
      return
    }
    const deleteStatus = await blogService.remove(blogObject.id)
    if (deleteStatus === 204) {
      setBlogs(blogs
        .filter(blog => blog.id !== blogObject.id)
        .sort((a, b) => b.likes - a.likes)
      )
    }
    else {
      setMessage({ content: `failed to delete ${blogObject.title} by ${blogObject.author}`, error: true })
      setTimeout(() => {
        setMessage({ content: null, error: false })
      }, 5000)
    }
  }

  const blogForm = () => {
    const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
    const showWhenVisible = { display: blogFormVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setBlogFormVisible(true)}>new note</button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm
            handleCreateBlog={handleCreateBlog}
          />
          <button onClick={() => setBlogFormVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  if (user === null) {
    return(
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input type="text" id='username' value={username} name="Username" onChange={({ target }) => setUsername(target.value)}/>
          </div>
          <div>
            password
            <input type="password" id='password' value={password} name="Password" onChange={({ target }) => setPassword(target.value)}/>
          </div>
          <button type="submit" id='login-button'>login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message}/>
      <div>{user.name} logged in<button onClick={handleLogout}>logout</button></div>
      <br/>
      {blogForm()}
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          loggedUser={user.username}
          blog={blog}
          handleBlogLike={handleBlogLike}
          handleRemoveBlog={handleRemoveBlog}
        />
      )}
    </div>
  )
}

export default App