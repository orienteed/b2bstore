describe('PDP Add to favorites test', () => {
  it('Visits the b2bStore web page', () => {
    cy.visit('https://b2bstore.orienteed.lan/')
    cy.wait(3000)
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

  it('Go into the first product in the carousel', () => {
    cy.contains('ADD TO CART').click()
  })

  it('Add to favorites', () => {
    cy.get('.ProductFullDetailB2B-favoritesButton-3aH > .addToListButton-root-1zf').click()
  })

})

