describe('Checkout test', () => {
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

  it('Searches by typing a product name and pressing ENTER', () => {
    cy.get('.searchTrigger-label-1X3').click()
    cy.get('input[name="search_query"]').type('TOWN').type('{enter}')
    cy.wait(6000)
    
  })

  it('Go into the PDP and add the product to the cart', () => {
    cy.get(':nth-child(1) > .item-name-3AC > span').click()
    // Wait for the button to activate
    cy.wait(6000)
    cy.contains('Add to Cart').click()
    cy.scrollTo(0, 0)
    cy.wait(6000)

  })


})

