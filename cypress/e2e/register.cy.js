describe('Registration test', () => {
  it('Visits the b2bStore web page', () => {
    cy.visit('https://b2bstore.orienteed.lan/')
    cy.wait(3000)
  })

  it('Click on Create new user and register', () => {
    cy.get('.signIn-buttonsContainer-jtP > .button-root_normalPriority-1bS').click()

    // Registration form
    // Company name
    cy.get('input[name="customer.firstname"]')
    .type('Orienteed')
    .should('have.value', 'Orienteed')
    cy.wait(2000)

    // Email
    cy.get('input[name="customer.email"]')
    .type('test@orienteed.com')
    .should('have.value', 'test@orienteed.com')
    cy.wait(2000)

    // Password
    cy.get('input[name="password"]')
    .type('12345678A_')
    cy.wait(2000)

    // Create account
    cy.get('.createAccount-submitButton-1yp').click()
    cy.wait(3000)
    
  })




})

