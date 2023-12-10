import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({
  loggedUser,
  blog,
  handleBlogLike,
  handleRemoveBlog
}) => {
  const [blogVisible, setBlogVisible] = useState(false)
  const hideWhenVisible = { display: blogVisible ? 'none' : '' }
  const showWhenVisible = { display: blogVisible ? '' : 'none' }
  const showRemove = { display: loggedUser === blog.user.username ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const updateBlogLike = async (event) => {
    event.preventDefault()
    handleBlogLike(blog)
  }

  const removeBlog = async (event) => {
    event.preventDefault()
    handleRemoveBlog(blog)
  }

  return (
    <div className='blog'>
      <div style={hideWhenVisible}>
        <div style={blogStyle}>
          <div>
            {blog.title} {blog.author}
            <button onClick={() => setBlogVisible(true)}>view</button>
          </div>
        </div>
      </div>
      <div style={showWhenVisible} className='detailed'>
        <div style={blogStyle}>
          <div>
            {blog.title} {blog.author}
            <button onClick={() => setBlogVisible(false)}>hide</button>
          </div>
          <div className='url'>{blog.url}</div>
          <div className='likes'>
            likes {blog.likes}
            <button onClick={updateBlogLike}>like</button>
          </div>
          <div>{blog.user.name}</div>
          <div style={showRemove} className='remove-button'>
            <button onClick={removeBlog}>remove</button>
          </div>
        </div>
      </div>
    </div>
  )
}

Blog.propTypes = {
  loggedUser: PropTypes.string.isRequired,
  blog: PropTypes.object.isRequired,
  handleBlogLike: PropTypes.func.isRequired,
  handleRemoveBlog: PropTypes.func.isRequired
}

export default Blog