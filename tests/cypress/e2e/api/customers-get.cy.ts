describe("Customers API GET tests", () => {
    //   const apiBaseURL = /

    it("gets all customers", () => {
        cy.request("GET", "/customers").then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.an("array")
            expect(response.body.length).to.be.greaterThan(0)
        })
    })
})
