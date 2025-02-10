import { faker } from "@faker-js/faker"

describe("Customers API POST tests", () => {
//   const apiBaseURL = /

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
    testUser.firstName = faker.person.firstName()
    testUser.lastName = faker.person.lastName()
    testUser.email = faker.internet.email()
    testUser.address1 = faker.location.streetAddress()
    testUser.address2 = faker.location.secondaryAddress()
    testUser.city = faker.location.city()
    testUser.state = faker.location.state()
    testUser.zip = faker.location.zipCode('#####')
    testUser.notes = faker.lorem.words(3)
  })

  let customerId: number

  it("adds a new customer with all properties valid", () => {
    cy.request("POST", "/customers", testUser).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body).to.have.property("id")
      expect(response.body).to.have.property("firstName", testUser.firstName)
      expect(response.body).to.have.property("lastName", testUser.lastName)
      expect(response.body).to.have.property("email", testUser.email)
      expect(response.body).to.have.property("address1", testUser.address1)
      expect(response.body).to.have.property("address2", testUser.address2)
      expect(response.body).to.have.property("city", testUser.city)
      expect(response.body).to.have.property("state", testUser.state)
      expect(response.body).to.have.property("zip", testUser.zip)
      expect(response.body).to.have.property("notes", testUser.email)
      customerId = response.body.id
      // reset db after POST test
    })
  })

    it("returns error when first name field is not sent", () => {
        delete testUser.firstName

        cy.request({
            method: "POST",
            url: "/customers",
            body: testUser,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400)
            expect(response.body).to.have.property("error")
        })
    })
})
