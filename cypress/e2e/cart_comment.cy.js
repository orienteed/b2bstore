describe('Cart comments test', () => {
  it('Visits the b2bStore web page', () => {
    cy.visit('https://b2bstore.orienteed.lan/')
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

