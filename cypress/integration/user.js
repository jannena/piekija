
before(async () => {
    // TODO: Clear database
    // TODO: Create user
    // TODO: Loan somethign to user
});

describe("when user is not logged in", () => {
    it("language can be changed", () => { });

    it("user can log in", () => {
        cy.get("login-button").click();
    });
});

describe("when user is logged in", () => {
    it("user can get their loans AND renew their loans", () => { });
    it("user can get their holds", () => { });
    it("user can edit their data", () => { });
    it("user can create a shelf", () => { });
    it("user can edit shelf", () => { });
    it("user can share and unshare a shelf", () => { });
    it("user can edit record note in the shelf", () => { });
    it("user can perform a simple search AND filter results AND see items AND place a hold AND add record to a shelf AND remove the hold AND remove the shelf", () => { });
});