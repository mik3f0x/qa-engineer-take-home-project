import { faker } from '@faker-js/faker';

describe('customers page', () => {
  const testUser = {
    firstName: "",
    lastName: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    notes: ""
  }

  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.visit('/')
  })

  context("adding a customer", () => {
    beforeEach(() => {
      testUser.firstName = faker.person.firstName()
      testUser.lastName = faker.person.lastName()
      testUser.email = faker.internet.email()
      testUser.address1 = faker.location.streetAddress()
      testUser.address2 = faker.location.secondaryAddress()
      testUser.city = faker.location.city()
      testUser.state = faker.location.state()
      testUser.zip = faker.location.zipCode('#####')
      testUser.notes = faker.lorem.words(3)
  
      cy.get("button").click()
      cy.get(".modal-body").should("exist")
      cy.getByData("first-name").type(testUser.firstName)
      cy.getByData("last-name").type(testUser.lastName)
      cy.getByData("email").type(testUser.email)
      cy.getByData("address-line-1").type(testUser.address1)
      cy.getByData("address-line-2").type(testUser.address2)
      cy.getByData("city").type(testUser.city)
      cy.getByData("state").type(testUser.state)
      cy.getByData("zip").type(testUser.zip)
      cy.getByData("notes").type(testUser.notes)
    })
  
    it('adds a user with all fields filled and valid', () => {
      cy.getByData("save-button").click()
      cy.get(".modal-body").should("not.exist")

      cy.get(".table-row").contains(testUser.firstName)
      cy.get(".table-row").contains(testUser.lastName)
      cy.get(".table-row").contains(testUser.email)
      cy.get(".table-row").contains(testUser.address1)
      cy.get(".table-row").contains(testUser.address2)
      cy.get(".table-row").contains(testUser.city)
      cy.get(".table-row").contains(testUser.state)
      cy.get(".table-row").contains(testUser.zip)
      cy.get(".table-row").contains(testUser.notes)
    })

    it('adds a user with only required fields filled and valid', () => {
      cy.getByData("address-line-2").clear()
      cy.getByData("notes").clear()

      cy.getByData("save-button").click()
      cy.get(".modal-body").should("not.exist")

      cy.get(".table-row").contains(testUser.firstName)
      cy.get(".table-row").contains(testUser.lastName)
      cy.get(".table-row").contains(testUser.email)
      cy.get(".table-row").contains(testUser.address1)
      cy.get(".table-row").contains(testUser.city)
      cy.get(".table-row").contains(testUser.state)
      cy.get(".table-row").contains(testUser.zip)
    })
  })  
})