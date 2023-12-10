import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog  from './Blog'

describe('<Blog />', () => {
  let container
  const handleBlogLike = jest.fn()
  const loggedUser = 'mluukkai'
  const blog = {
    title: 'Things I Don\'t Know as of 2018',
    author: 'Dan Abramov',
    url: 'https://overreacted.io/things-i-dont-know-as-of-2018/',
    likes: 10,
    user: {
      id: '653e919a2d75dec3018c9653',
      username: 'mluukkai',
      name: 'Matti Luukkainen'
    },
    id: '65748f2aec70f585cc66c103'
  }

  beforeEach(() => {
    container = render(<Blog
      loggedUser={loggedUser}
      blog={blog}
      handleBlogLike={handleBlogLike}
      handleRemoveBlog={() => {}}
    />).container
  })

  test('url and likes are not shown by default', () => {
    const hiddenPart = container.querySelector('.detailed')
    expect(hiddenPart).toHaveStyle('display: none')
  })

  test('url and likes are shown when \'view\' is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const hiddenPart = container.querySelector('.detailed')
    expect(hiddenPart).not.toHaveStyle('display: none')
  })

  test('event handler for like button is called twice when it is clicked twice', async () => {
    const user = userEvent.setup()
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(handleBlogLike.mock.calls).toHaveLength(2)
  })
})