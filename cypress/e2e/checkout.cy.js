describe('Checkout test', () => {
  it('Visits the b2bStore web page', () => {
    cy.visit('https://b2b-admin.orienteed.lan')
  })

  it('Searches by typing a product name and pressing ENTER', () => {
    cy.get('#search')
    .type('ROD')
    .should('have.value', 'ROD')
    .type('{enter}')
  })

  it('Go into the PDP and add the product to the cart', () => {
    cy.get('#product-item-info_2452 > .photo > .product-image-container > .product-image-wrapper > .product-image-photo')
    .invoke('show').click()
    // Wait for the button to activate
    cy.wait(6000)
    cy.contains('Add to Cart').click()
    cy.scrollTo(0, 0)
    cy.wait(6000)

  })

  it('Check the cart and proceed to checkout', () => {
    //Wait for the item to be added
    cy.get('.showcart').click()
    cy.wait(3000)
    cy.get('#top-cart-btn-checkout').click()
  })
  

})

