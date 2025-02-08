describe('customers page', () => {
  it('passes', () => {
    cy.viewport(1920, 1080)
    cy.visit('/')
    cy.get("button").click()
    cy.get(".modal-body").should("exist")
    cy.get('[data-testid="first-name"]').type("Helen")
    cy.get('[data-testid="last-name"]').type("Ready")
    cy.get('[data-testid="save-button"]').click()
    cy.get(".modal-body").should("not.exist")
    cy.get(".table-row")
    .contains("Helen").parent()
    .contains("Ready");  // Check if "Ready" is in the same row
    })
})