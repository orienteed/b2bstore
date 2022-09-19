describe('Pagination variants in PDP test', () => {
  it('Visits the b2bStore web page', () => {
    cy.visit('https://b2bstore.orienteed.lan/')
  })

  it('Log in', () => {

    // Login info
    cy.contains('div', 'Email address').find('input').first()
    .type('test@orienteed.com')  
    .should('have.value', 'test@orienteed.com')

    cy.wait(3000)

    cy.contains('div', 'Password').find('input').first()
    .type('12345678A_')

    cy.wait(3000)

    // Login button
    cy.get('.button-root_highPriority-3v-').click()

    cy.wait(6000)

  })

  it('Click on Create new user and register', () => {
    cy.get('.panel > .header > .link > a').click()
    cy.get('.login-container > .block-new-customer > .block-content > .actions-toolbar > div.primary > .action').click()

    // Registration form
    cy.get('#firstname')
    .type('Miguel')
    .should('have.value', 'Miguel')

    cy.get('#lastname')
    .type('Perez')
    .should('have.value', 'Perez')

    cy.get('#email_address')
    .type('test@orienteed.com')
    .should('have.value', 'test@orienteed.com')

    cy.get('#password')
    .type('12345678A_')

    cy.get('#password-confirmation')
    .type('12345678A_')

    cy.get('#form-validate > .actions-toolbar > div.primary > .action').click()
    
  })




})

