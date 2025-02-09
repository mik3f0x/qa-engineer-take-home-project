describe('customers page', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.visit('/')
  })

  context("adding a customer", () => {
    it('passes', () => {
      cy.get("button").click()
      cy.get(".modal-body").should("exist")
      cy.getByData("first-name").type("Helen")
      cy.getByData("last-name").type("Ready")
      cy.getByData("save-button").click()
      cy.get(".modal-body").should("not.exist")
      cy.get(".table-row").contains("Helen")
      cy.get(".table-row").contains("Ready")
    })
  })  
})