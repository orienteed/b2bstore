describe('Learning page test', () => {
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

  it('Check the learning page', () => {

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




})

