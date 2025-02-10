import { faker } from '@faker-js/faker'

describe("customers page", () => {
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
    cy.viewport(1920, 1080) // needed for the app to render properly
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
  
      cy.contains("button", "Add Customer").click() // This button's data-testid="add-customer-button" is not being passed to the DOM, for some reason
      cy.getByData("add-modal").should("exist")
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
  
    it("adds a customer with all fields filled and valid", () => {
      cy.getByData("save-button").click()
      cy.getByData("add-modal").should("not.exist")

      cy.getByData("table-row").eq(-1).contains(testUser.firstName)
      cy.getByData("table-row").eq(-1).contains(testUser.lastName)
      cy.getByData("table-row").eq(-1).contains(testUser.email)
      cy.getByData("table-row").eq(-1).contains(testUser.address1)
      cy.getByData("table-row").eq(-1).contains(testUser.address2)
      cy.getByData("table-row").eq(-1).contains(testUser.city)
      cy.getByData("table-row").eq(-1).contains(testUser.state)
      cy.getByData("table-row").eq(-1).contains(testUser.zip)
      cy.getByData("table-row").eq(-1).contains(testUser.notes)
      // Probably could have written a custom command for these types of lines
    })

    it("adds a customer with only required fields filled and valid", () => {
      cy.getByData("address-line-2").clear()
      cy.getByData("notes").clear()

      cy.getByData("save-button").click()
      cy.getByData("add-modal").should("not.exist")

      cy.getByData("table-row").eq(-1).contains(testUser.firstName)
      cy.getByData("table-row").eq(-1).contains(testUser.lastName)
      cy.getByData("table-row").eq(-1).contains(testUser.email)
      cy.getByData("table-row").eq(-1).contains(testUser.address1)
      cy.getByData("table-row").eq(-1).contains(testUser.city)
      cy.getByData("table-row").eq(-1).contains(testUser.state)
      cy.getByData("table-row").eq(-1).contains(testUser.zip)
    })

    it("prevents adding a customer with first name blank", () => {
      cy.getByData("first-name").clear()

      cy.getByData("save-button").click()

      // Assuming Save button action is blocked and an error message appears inside the modal with data-testid="error-message"
      cy.getByData("error-message").contains("You must enter a first name")
      cy.get(".close-button").click()
      cy.getByData("add-modal").should("not.exist")
      cy.getByData("table-row").eq(-1).contains(testUser.email).should("not.exist") // Assuming email is the only unique identifier
    })

    it("prevents adding a customer with invalid email missing @", () => {
      cy.getByData("email").clear().type("tomexample.com")

      cy.getByData("save-button").click()

      // Assuming Save button action is blocked and an error message appears inside the modal with data-testid="error-message"
      cy.getByData("error-message").contains("You must enter a valid email address")
      cy.get(".close-button").click()
      cy.getByData("add-modal").should("not.exist")
      cy.getByData("table-row").eq(-1).contains("tomexample.com").should("not.exist") // Assuming email is the only unique identifier
    })

    it("prevents adding a customer with invalid email missing dot domain", () => {
      cy.getByData("email").clear().type("tom@examplecom")

      cy.getByData("save-button").click()

      // Assuming Save button action is blocked and an error message appears inside the modal with data-testid="error-message"
      cy.getByData("error-message").contains("You must enter a valid email address")
      cy.get(".close-button").click()
      cy.getByData("add-modal").should("not.exist")
      cy.getByData("table-row").eq(-1).contains("tom@examplecom").should("not.exist") // Assuming email is the only unique identifier
    })

    it("prevents adding a customer with invalid zip code with 4 digits", () => {
      cy.getByData("zip").clear().type("1111")

      cy.getByData("save-button").click()

      // Assuming Save button action is blocked and an error message appears inside the modal with data-testid="error-message"
      cy.getByData("error-message").contains("You must enter a valid zip code")
      cy.get(".close-button").click()
      cy.getByData("add-modal").should("not.exist")
      cy.getByData("table-row").eq(-1).contains(testUser.email).should("not.exist") // Assuming email is the only unique identifier
    })

    it("prevents adding a customer with invalid zip code with non-numeric character", () => {
      cy.getByData("zip").clear().type("11a11")

      cy.getByData("save-button").click()

      // Assuming Save button action is blocked and an error message appears inside the modal with data-testid="error-message"
      cy.getByData("error-message").contains("You must enter a valid zip code")
      cy.get(".close-button").click()
      cy.getByData("add-modal").should("not.exist")
      cy.getByData("table-row").eq(-1).contains(testUser.email).should("not.exist") // Assuming email is the only unique identifier
    })

    // it("prevents adding a customer with all fields blank", () => {})
    // it("prevents adding a customer with any required field blank", () => {})
    // it("prevents adding a customer with injected code in a field", () => {})
    // it("prevents adding a customer with single char entries / consecutive spaces", () => {})
    // Stronger state, zip Code, email validation, etc.
  })
  
  
  context("finding customers", () => {
    // all tests assume a search field with action on "enter"
    // Assuming pre-seeded db or production db with test users that can be reset after each test
    it("finds and displays multiple customers from a text string search", () => {
      cy.getByData("search-field").type(`.com{enter}`)
      cy.getByData("table-row").should("have.length.greaterThan", 1)
      cy.getByData("table-row").each(($row) => {
        cy.wrap($row).should("contain.text", ".com")
      })      
    })

    it("finds and displays a single customer from an exact match search", () => {
      cy.getByData("search-field").type(`Test user 1{enter}`)
      cy.getByData("table-row")
      .should("have.length", 1)
      .and("contain.text", "Test user 1")
    })

    it("displays zero table rows when a query match is not found", () => {
      cy.getByData("search-field").type(`x1x1x1x{enter}`)
      cy.getByData("table-row").should("not.exist") // fix this, negative assertion likely to cause false positive by passing before rows render
    }) 
    
    // What's expected behavior for empty search? Yields all rows?
  })


  context("editing a customer", () => {
    // Assumptions:
    //    Table rows are clickable. Clicking on a row opens an "Edit Customer" modal.
    //    The modal has fields populated with the existing text.
    //    The modal has a "Save Changes" button That closes it and updates the customer.
    //    The model has a "Cancel" button which closes it
    // Assuming pre-seeded db or production db with test users that can be reset after each test

    it("edits an existing customer", () => {
      const customerToEdit = "Test user 1"
      const newFirstName = faker.person.firstName()
      let oldFirstName: string

      cy.contains('[data-testid="table-row"]', customerToEdit)
        .find("td")
        .eq(0)
        .then(($td) => {
          oldFirstName = $td.text()
        })

      cy.contains('[data-testid="table-row"]', customerToEdit).should("exist").click()
      cy.getByData("customer-modal").should("exist")
      cy.getByData("edit-first-name").type(newFirstName)
      cy.getByData("save-changes-button").click()
      cy.getByData("customer-modal").should("not.exist")

      cy.contains('[data-testid="table-row"]', customerToEdit)
        .find("td")
        .eq(0)
        .then(($td) => {
          const finalFirstName = $td.text()

          expect(finalFirstName).to.not.equal(oldFirstName)
          expect(finalFirstName).to.equal(newFirstName)
        })
      
      // Other tests: Updating with invalid entries, etc. Cancel behavior. Delete non-required fields
    })
  })


  context("deleting a customer", () => {
    it("deletes a customer", () => {
      const customerToDelete = "Test user 1"

      cy.contains('[data-testid="table-row"]', customerToDelete).should("exist").click()
    
      cy.getByData("customer-modal").should("exist")
      cy.getByData("delete-button").click()
    
      cy.getByData("delete-modal-body").should("contain.text", "Are you sure you want to delete this customer?")    
      cy.getByData("ok-button").click()
    
      cy.getByData("delete-modal-body").should("not.exist")
      cy.getByData("customer-modal").should("not.exist")
    
      cy.getByData("search-field").type(`${customerToDelete}{enter}`)
      cy.getByData("table-row").should("not.exist") // fix this, negative assertion likely to cause false positive by passing before rows render
    })

    // Also test cancel functionality
  })
})