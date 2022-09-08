describe('PDP Add to favorites test', () => {
  it('Visits the b2bStore web page', () => {
    cy.visit('https://b2b-admin.orienteed.lan')
  })

  it('Log in', () => {
    cy.get('.panel > .header > .link > a').click()

    // Login info
    cy.get('#email')
    .type('test@orienteed.com')  
    .should('have.value', 'test@orienteed.com')

    cy.get('.login-container > .block-customer-login > .block-content > #login-form > .fieldset > .password > .control > #pass')
    .type('12345678A_')

    // Login button
    cy.get('.login-container > .block-customer-login > .block-content > #login-form > .fieldset > .actions-toolbar > div.primary > #send2').click()

  })

  it('Go into the first product in the carousel', () => {
    cy.get(':nth-child(1) > .product-item-info > .product-item-photo > .product-image-container > .product-image-wrapper > .product-image-photo').click()
  })



})

