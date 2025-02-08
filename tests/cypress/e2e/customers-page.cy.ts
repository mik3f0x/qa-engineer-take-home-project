describe('customers page', () => {
  it('passes', () => {
    cy.viewport(1920, 1080)
    cy.visit('/')
    cy.get("button").click()
    cy.get(".modal-body").should("exist")
    cy.getByData("first-name").type("Helen")
    cy.getByData("last-name").type("Ready")
    cy.getByData("save-button").click()
    cy.get(".modal-body").should("not.exist")
    cy.get(".table-row").contains("Helen")
    .parent().contains("Ready")
    })
})