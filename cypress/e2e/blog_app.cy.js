describe('Blog app', () => {
  beforeEach(() => {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    })
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, {
      name: 'Arto Hellas',
      username: 'hellas',
      password: 'salainen'
    })
    cy.visit('')
  })
  
  it('Login form is shown', () => {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', () => {
    it('succeeds with correct credentials', () => {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('Matti Luukkainen logged in')
    })
    it('fails with wrong credentials', () => {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.get('.error').contains('wrong username or password')
    })
  })

  describe('When logged in', () => {
    beforeEach(() => {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
    })

    it('A blog can be created', () => {
      cy.contains('new note').click()
      cy.get('#title').type('The Joel Test: 12 Steps to Better Code')
      cy.get('#author').type('Joel Spolsky')
      cy.get('#url').type('https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/')
      cy.get('#create-button').click()
      cy.get('.success').contains('a new blog The Joel Test: 12 Steps to Better Code by Joel Spolsky added')
      cy.contains('The Joel Test: 12 Steps to Better Code Joel Spolsky')
    })

    describe('and a blog of that user exists', () => {
      beforeEach(() => {
        cy.login({ username: 'mluukkai', password: 'salainen' })
        cy.createBlog({
          title: 'The Joel Test: 12 Steps to Better Code',
          author: 'Joel Spolsky',
          url: 'https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/'
        })
      })

      it('A user can like a blog', () => {
        cy.contains('The Joel Test: 12 Steps to Better Code Joel Spolsky')
          .contains('view')
          .click()
        cy.contains('likes 0')
          .contains('like')
          .click()
        cy.contains('likes 1')
      })

      it('A user who created a blog can remove it', () => {
        cy.contains('The Joel Test: 12 Steps to Better Code Joel Spolsky')
          .contains('view')
          .click()
        cy.contains('remove').click()
        cy.contains('The Joel Test: 12 Steps to Better Code Joel Spolsky').should('not.exist')
      })
    })

    describe('and a blog of another user exists', () => {
      beforeEach(() => {
        cy.login({ username: 'hellas', password: 'salainen' })
        cy.createBlog({
          title: 'Things I Don\'t Know as of 2018',
          author: 'Dan Abramov',
          url: 'https://overreacted.io/things-i-dont-know-as-of-2018/'
        })
        cy.login({ username: 'mluukkai', password: 'salainen' })
      })

      it('A user who did not create a blog cannot remove it', () => {
        cy.contains('Things I Don\'t Know as of 2018')
          .contains('view')
          .click()
        cy.get('.remove-button').should('have.css', 'display', 'none')
        // cy.contains('The Joel Test: 12 Steps to Better Code Joel Spolsky').should('not.exist')
      })
    })

    describe('and some blogs exists', () => {
      beforeEach(() => {
        cy.login({ username: 'mluukkai', password: 'salainen' })
        cy.createBlogWithLikes({
          title: 'The Joel Test: 12 Steps to Better Code',
          author: 'Joel Spolsky',
          url: 'https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/',
          likes: 10
        })
        cy.createBlogWithLikes({
          title: 'Things I Don\'t Know as of 2018',
          author: 'Dan Abramov',
          url: 'https://overreacted.io/things-i-dont-know-as-of-2018/',
          likes: 5
        })
      })

      it('blogs are displayed according to likes with the blog with the most likes being first', () => {
        cy.get('.blog').eq(0).should('contain', 'The Joel Test: 12 Steps to Better Code Joel Spolsky')
        cy.get('.blog').eq(1).should('contain', 'Things I Don\'t Know as of 2018 Dan Abramov')
      })
    }) 
  })
})

Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedBloglistappUser', JSON.stringify(body))
    cy.visit('')
  })
})

Cypress.Commands.add('createBlog', ({ title, author, url }) => {
  cy.request({
    url: `${Cypress.env('BACKEND')}/blogs`,
    method: 'POST',
    body: { title, author, url },
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBloglistappUser')).token}`
    }
  })

  cy.visit('')
})

Cypress.Commands.add('createBlogWithLikes', ({ title, author, url, likes }) => {
  cy.request({
    url: `${Cypress.env('BACKEND')}/blogs`,
    method: 'POST',
    body: { title, author, url, likes },
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBloglistappUser')).token}`
    }
  })

  cy.visit('')
})