import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('create new blog', async () => {
    const handleCreateBlog = jest.fn()
    const user = userEvent.setup()
    render(<BlogForm handleCreateBlog={handleCreateBlog} />)
    const title = screen.getByLabelText('title:')
    const author = screen.getByLabelText('author:')
    const url = screen.getByLabelText('url:')
    const createButton = screen.getByText('create')

    await user.type(title, 'The Joel Test: 12 Steps to Better Code')
    await user.type(author, 'Joel Spolsky')
    await user.type(url, 'https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/')
    await user.click(createButton)

    expect(handleCreateBlog.mock.calls).toHaveLength(1)
    expect(handleCreateBlog.mock.calls[0][0]).toEqual({
      title: 'The Joel Test: 12 Steps to Better Code',
      author: 'Joel Spolsky',
      url: 'https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/'
    })
  })
})