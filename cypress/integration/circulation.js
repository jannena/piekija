
before(() => {
    cy.request("POST", "http://localhost:3001/debug/reset");
    cy.request("POST", "http://localhost:3001/debug/initrecords");
    cy.visit("http://localhost:3000");
});

describe("when staff user is logged in", () => {
    it("user can place a hold for items and select pick-up location (twice) and it will show up in holds", () => {
        cy.get("#log-in-user-menu").click();
        cy.get("#username").type("basicuser");
        cy.get("#current-password").type("salasana");
        cy.get("#log-in-button").click();

        cy.get("#main-search-field").type("Imaginaerum");
        cy.get("#search-button").click();
        cy.contains("Imaginaerum").click();
        cy.get(".pickup-location").select("This is a new location");
        cy.contains("Not loaned"); // EVO
        cy.contains("Loaned").should("not.exist"); // EVO
        cy.get("#place-a-hold-button").click();

        cy.contains("A new hold was created"); // EVO
        cy.contains("Holds: 1"); // EVO
        cy.contains("Your queue number: 1"); // EVO
        cy.contains("Pick-up location: This is a location"); // EVO


        // AGAIN
        cy.get("#main-search-field").type("Liitu-ukko");
        cy.get("#search-button").click();
        cy.contains("Liitu-ukko").click();
        cy.get(".pickup-location").select("This is the second location");
        cy.contains("Not loaned"); // EVO
        cy.contains("Loaned").should("not.exist"); // EVO
        cy.get("#place-a-hold-button").click();

        cy.contains("A new hold was created"); // EVO
        cy.contains("Holds: 1"); // EVO
        cy.contains("Your queue number: 1"); // EVO
        cy.contains("Pick-up location: This is the second location"); // EVO

        cy.get("#log-in-user-menu").click();
        cy.get("#user-link").click();
        cy.contains("Holds").click(); // EVO
        cy.contains("Liitu-ukko");
        cy.contains("Imaginaerum");
        cy.contains("Queue  number: 1"); // EVO
        cy.contains("Pick-up location: This is a new location"); // EVO
        cy.contains("Pick-up-location: This is the second location"); // EVO
    });

    it("another user can place a hold and their queue number will be correct", () => {
        cy.reload();
        cy.get("#log-in-user-menu").click();
        cy.get("#username").type("usicbaser");
        cy.get("#current-password").type("salasana");
        cy.get("#log-in-button").click();

        cy.get("#main-search-field").type("Imaginaerum");
        cy.get("#search-button").click();
        cy.contains("Imaginaerum").click();
        cy.get(".pickup-location").select("This is the second location");
        cy.contains("Placed a hold"); // EVO
        cy.contains("Not loaned").should("not.exist"); // EVO
        cy.get("#place-a-hold-button").click();

        cy.contains("A new hold was created"); // EVO
        cy.contains("Holds: 2"); // EVO
        cy.contains("Your queue number: 2"); // EVO
        cy.contains("Pick-up location: This is the second location"); // EVO

        // AGAIN
        cy.get("#main-search-field").type("Liitu-ukko");
        cy.get("#search-button").click();
        cy.contains("Liitu-ukko").click();
        cy.get(".pickup-location").select("This is a new location");
        cy.contains("Placed a hold"); // EVO
        cy.contains("Not loaned").should("not.exist"); // EVO
        cy.get("#place-a-hold-button").click();

        cy.contains("A new hold was created"); // EVO
        cy.contains("Holds: 2"); // EVO
        cy.contains("Your queue number: 2"); // EVO
        cy.contains("Pick-up location: This is a location"); // EVO
    });

    it("staff can receive correct pick-up location", () => {
        cy.reload();
        cy.get("#log-in-user-menu").click();
        cy.get("#username").type("adminuser");
        cy.get("#current-password").type("salasana");
        cy.get("#log-in-button").click();

        cy.get("#log-in-user-menu").click();
        cy.get("#staff-link").click();

        cy.contains("Holds").click(); // EVO
        cy.get(".tabs select").select("This is a new location");
        cy.contains("Get").click(); // EVO
        cy.contains("Imaginaerum");
        cy.contains("Liitu-ukko");
        cy.contains("Holds: 1");
        cy.contains("Holds: 2").should("not.exist");
        cy.contains("Pick-up location: This is a new location"); // EVO
        cy.contains("Pick-up location: This is the second location"); // EVO

        cy.contains("Circulation").click(); // EVO
        cy.get(".tabs select").select("This is a new location");
        cy.get("#set-location-button").click();

        cy.get("#item").type("1/1");
        cy.get("#search-item-button").click();
        cy.contains("Imaginaerum");
        cy.contains("State: Placed a hold"); // EVO
        cy.contanins("There are holds for this item"); // EVO
        cy.contains("Hold this item for its hold placer"); // EVO

        cy.get("#item").clear().type("2/1");
        cy.get("#search-item-button").click();
        cy.contains("Liitu-ukko");
        cy.contains("State: Placed a hold"); // EVO
        cy.contains("There are holds for this item"); // EVO
        cy.contains("Send this item for its hold placer"); // EVO

    });

    it("first user can remove a hold", () => {
        cy.reload();
        cy.get("#log-in-user-menu").click();
        cy.get("#username").type("basicuser");
        cy.get("#current-password").type("salasana");
        cy.get("#log-in-button").click();

        cy.contains("Holds").click(); // EVO
        cy.get(".hold button").eq(1).click();
        cy.contains("A new hold was removed"); // EVO
        cy.contains("Imaginaerum").should("not.exist");
    });

    it("another user can get correct queue number", () => {
        cy.reload();
        cy.get("#log-in-user-menu").click();
        cy.get("#username").type("usicbaser");
        cy.get("#current-password").type("salasana");
        cy.get("#log-in-button").click();

        cy.contains("Holds").click(); // EVO
        cy.contains("Queue number: 1"); // EVO
        cy.contains("Queue number: 2"); // EVO
    });

    it("staff can get correct pick-up location again", () => {
        cy.reload();
        cy.get("#log-in-user-menu").click();
        cy.get("#username").type("adminuser");
        cy.get("#current-password").type("salasana");
        cy.get("#log-in-button").click();

        cy.get("#log-in-user-menu").click();
        cy.get("#staff-user").click();
        cy.contains("Holds").click(); // EVO
        cy.get(".tabs select").select("This is a new location");
        cy.contains("Get").click(); // EVO

        cy.contains("Holds: 1"); // EVO
        cy.contains("Pick-up location: This is the second location");
        cy.contains("Pick-up location: This is a new location").should("not.exist");
    });

    it("staff can reserve item for hold placer", () => {
        cy.get(".tabs select").select("This is a new location");
        cy.get("#set-location-button").click();

        cy.contains("Circulation").click(); // EVO
        cy.get("#item").type("1/2");
        cy.get("#item-search-button").click();
        cy.contains("Send this item for its hold placer").click(); // EVO
        cy.contains("Pick-up location of current item: This is the second location");
        cy.contains("Reserved for: Usic Baser (usicbaser)");


        cy.get(".tabs select").select("This is the second location");
        cy.get("#set-location-button").click();

        cy.get("#item").clear().type("2/1");
        cy.get("#item-search-button").click();
        cy.contains("Hold this item for its hold placer").click(); // EVO
        cy.contains("Mark as pick-up").click(); // EVO
    });

    it("first user get correct notifications on holds tab", () => {
        cy.reload();
        cy.get("#log-in-user-menu").click();
        cy.get("#username").type("usicbaser");
        cy.get("#current-password").type("salasana");
        cy.get("#log-in-button").click();

        cy.contains("Holds").click(); // EVO
        cy.contains("State: Being carried"); // EVO
        cy.contains("State: Pick-up"); // EVO

        cy.get("#main-search-field").type("Imaginaerum");
        cy.get("#search-button").click();
        cy.contains("Imaginaerum").click();
        cy.contains("Being carried"); // EVO
        cy.contains("Not loaned"); // EVO

        cy.get("#main-search-field").type("Liitu-ukko");
        cy.get("#search-button").click();
        cy.contains("Liitu-ukko").click();
        cy.contains("Pick-up") // EVO
        cy.contains("Placed a hold"); // EVO
    });

    it("staff can loan items", () => {
        cy.reload();
        cy.get("#log-in-user-menu").click();
        cy.get("#username").type("adminuser");
        cy.get("#current-password").type("salasana");
        cy.get("#log-in-button").click();

        cy.get("#log-in-user-menu").click();
        cy.get("#staff-link").click();

        cy.contains("Circulation").click(); // EVO
        cy.get("#item").type("2/1");
        cy.get("#item-search-button").click();
        cy.get("#user").type("usicbaser");
        cy.get("#user-search-button").click();
        cy.contains("Reserved for: Usic Baser"); // EVO
        cy.contains("State: Pick-up"); // EVO
        cy.contains("Loan item to Usic Baser").click(); // EVO
        cy.contains("State: Loaned for Admin User (adminuser)");

        cy.get(".tabs select").select("This is the second location");
        cy.get("#set-location-button").click();

        cy.get("#item").clear().type("1/2");
        cy.get("#item-search-button").click();
        cy.contains("Mark pick-up").click(); // EVO
        cy.contains("Loan item for Usic Baser (usicbaser)").click(); // EVO
    });

    it("item states are correct", () => {
        cy.reload();

        cy.get("#main-search-field").type("Imaginaerum");
        cy.get("#search-button").click();
        cy.contains("Imaginaerum").click();
        cy.contains("Loaned"); // EVO
        cy.contains("Not loaned"); // EVO

        cy.get("#main-search-field").type("Liitu-ukko");
        cy.get("#search-button").click();
        cy.contains("Liitu-ukko").click();
        cy.contains("Placed a hold"); // EVO
        cy.contains("Loaned"); // EVO
    });

    it("staff can return items", () => {
        cy.get("#log-in-user-menu").click();
        cy.get("#username").type("adminuser");
        cy.get("#current-password").type("salasana");
        cy.get("#log-in-button").click();

        cy.get("#log-in-user-menu").click();
        cy.get("#staff-link").click();
        cy.contains("Circulation").click(); // EVO

        cy.get("#user").type("usicbaser");
        cy.get("#user-search-button").click();
        cy.get("Users").click(); // EVO
        cy.get("Loans").click(); // EVO
        cy.get(".loan .return-button").eq(1).click();
        cy.contains("Item was returned");
        cy.contains("Liitu-ukko").should("not.exist");
        cy.contains("Loans: 1");
    });

    it("staff can renew items", () => {
        cy.contains("Renew times left: 10");
        cy.get(".loan .renew-button").click();
        cy.contains("Item was renewed");
        cy.contains("Renew times left: 9");
    });

    it("item states are correct 2", () => {
        cy.reload();

        cy.get("#main-search-field").type("Imaginaerum");
        cy.get("#search-button").click();
        cy.contains("Imaginaerum").click();
        cy.contains("Loaned"); // EVO
        cy.contains("Not loaned"); // EVO

        cy.get("#main-search-field").type("Liitu-ukko");
        cy.get("#search-button").click();
        cy.contains("Liitu-ukko").click();
        cy.contains("Placed a hold"); // EVO
        cy.contains("Placed a hold"); // EVO
    });

    it("user can renew items", () => {
        cy.reload();

        cy.get("#log-in-user-menu").click();
        cy.get("#username").type("usicbaser");
        cy.get("#current-password").type("salasana");
        cy.get("#log-in-button").click();

        cy.contains("Renew times left: 9"); // EVO
        cy.get(".loan .renew-button").eq(0).click();
        cy.contains("Item was renewed");
        cy.contains("Renew times left: 8"); // EVO
    });


    // TODO: Can be loaned to user after becoming 'not loaned' after 'placed a hold'
});