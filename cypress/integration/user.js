
/*
These tests tests:
- shelves
- user editing and TFA enablation
- reviews
*/

before(() => {
    cy.request("POST", "http://localhost:3001/debug/reset");
    cy.visit("http://localhost:3000");
});

describe("when user is logged in", () => {
    it("user can log in", () => {
        cy.get("#log-in-user-menu").click();
        cy.get("#username").type("basicuser");
        cy.get("#current-password").type("salasana");
        cy.get("#log-in-button").click();
    });

    it("user can edit their data", () => {
        cy.contains("Edit me").click(); // EVO
        cy.get("#name").clear().type("My new name");
        cy.get("#password").type("uusisalasana");
        cy.get("#againPassword").type("uusisalasana");
        cy.get("#oldPassword").type("salasana");
        cy.contains("Save").click(); // EVO
        cy.contains("User infomation was updated"); // EVO
        cy.contains("Basic User").should("not.exist");
        cy.contains("Two-factor authentication").click() // EVO
        cy.contains("My new name");
    });

    it("user can enable and disable two-factor authentication", () => {
        cy.contains("Disabled"); // EVO
        cy.get("#current-password").type("uusisalasana");
        cy.contains("Enable").click(); // EVO
        cy.contains("Enabled"); // EVO
        cy.contains("Two-factor authentication was enabled");
        cy.get(".close-notification").first().click();
        cy.get("img#tfaqr");
        cy.get("#current-password").type("uusisalasana");
        cy.contains("Disable").click(); // EVO
        cy.contains("Disabled");
        cy.contains("Two-factor authentication was disabled");
        cy.get(".close-notification").first().click();
    });

    it("user can create a shelf", () => {
        cy.contains("Shelves").click() // EVO
        cy.contains("My shelves").click() // EVO
        cy.get("input[name='newShelfName']").type("Hyllykkö");
        cy.get(".tabs form button").click();
        cy.contains("Shelf was created");
        cy.get(".close-notification").first().click();

        // Second shelf (for testing removing)
        cy.get("input[name='newShelfName']").clear().type("Parempi");
        cy.get(".tabs form button").click();
        cy.contains("Shelf was created");
        cy.get(".close-notification").first().click();
    });

    it("user can remove shelf", () => {
        cy.contains("Parempi").click();
        cy.contains("Remove shelf").click(); // EVO
        cy.get(".close-notification").first().click();
        cy.get(".tabs input").type("Paremp");
        cy.get(".tabs button").should("have.attr", "disabled");
        cy.get(".tabs input").type("i");
        cy.get(".tabs button").click();

        cy.contains("Shelves").click(); // EVO
        cy.contains("Parempi").should("not.exist");
    });

    it("user can edit shelf", () => {
        cy.contains("Hyllykkö").click();

        cy.contains("About shelf").click();
        cy.get(".tabs button").click();
        cy.get("#name").clear().type("bettername");
        cy.get("#description").type("List of all the perks of being a John Doe");
        cy.get("#public").check();
        cy.get(".tabs form button").eq(1).click();
        cy.contains("Shelf was updated");
        cy.get(".close-notification").first().click();
        cy.contains("Edit"); // EVO
        cy.contains("Cancel").should("not.exist");
        cy.contains("bettername");
        cy.contains("List of all the perks of being a John Doe");

        cy.get(".tabs button").click();
        cy.get("#public").should("have.attr", "checked");
        cy.contains("Cancel").click(); //EVO
    });

    it("user can share and unshare a shelf", () => {
        cy.contains("Share with").click(); // EVO
        cy.get(".tabs input").type("adminuser");
        cy.get(".tabs button").click();
        cy.contains("Shelf was shared with adminuser");
        cy.get(".close-notification").first().click();

        cy.contains("Unshare").click(); // EVO
        cy.contains("Shelf was unshared with adminuser");
        cy.get(".close-notification").first().click();

        // Share again
        cy.get(".tabs input").type("adminuser");
        cy.get(".tabs button").click();
        cy.contains("Shelf was shared with adminuser");
        cy.get(".close-notification").first().click();
    });

    it("user can add record to shelf", () => {
        cy.get("#main-search-field").type("Imaginaerum");
        cy.get("#search-button").click();
        cy.contains("Imaginaerum").click();
        cy.get("select").first().select("bettername");
        cy.contains("Add to shelf").click(); // EVO
        cy.contains("Record was added to the shelf");
        cy.get(".close-notification").first().click();

        cy.get("#main-search-field").clear().type("Tudor");
        cy.get("#search-button").click();
        cy.contains("Liitu-ukko").click();
        cy.get("select").first().select("bettername");
        cy.contains("Add to shelf").click(); // EVO
        cy.get(".close-notification").first().click();

        cy.get("#main-search-field").clear();

        cy.contains("My new name").click();
        cy.get("#user-link").click();
        cy.contains("Shelves").click(); // EVO
        cy.contains("bettername").click();
        cy.contains("Imaginaerum");
        cy.contains("Liitu-ukko");
    });

    it("user can edit record note in the shelf", () => {
        cy.get(".shelf-record .shelf-record-edit-button").eq(0).click();
        cy.get(".shelf-record textarea").eq(0).type("iprem losum. Kuka olet sinä? Kua varka nevalkastanmarkulnatapavaiskorhalkonahkasteri.");
        cy.get(".shelf-record-save-button").click();
        cy.get(".close-notification").first().click();

        cy.get(".shelf-record .shelf-record-edit-button").eq(1).click();
        cy.get(".shelf-record textarea").eq(0).type("Lorem ipsum!");
        cy.get(".shelf-record-save-button").click();
        cy.get(".close-notification").first().click();

        cy.contains("Note was updated");
        cy.contains("iprem losum. Kuka olet sinä? Kua varka nevalkastanmarkulnatapavaiskorhalkonahkasteri.");
        cy.get(".tabs .shelf-record-delete-button").eq(0).click();
        cy.get(".close-notification").first().click();
    });

    it("user can write a review", () => {
        cy.contains("Liitu-ukko").click();
        cy.contains("Reviews").click(); // EVO
        cy.get(".expandable-title").click();
        cy.get("#review").type("I love this book. Amo questo libro. Ce livre, Je l'aime. Ich liebe diese Buch. Rakastan tätä kirjaa.");
        cy.get("#isPublic").check();
        cy.get("#score").select("4");
        cy.get(".expandable-content button").click();
        cy.get(".expandable-title").click();
        cy.contains("My new name");
        cy.contains("Score: 4") // EVO
        cy.contains("I love this book. Amo questo libro. Ce livre, Je l'aime. Ich liebe diese Buch. Rakastan tätä kirjaa.");


        cy.get("#main-search-field").type("Imaginaerum");
        cy.get("#search-button").click();
        cy.contains("Imaginaerum").click();
        cy.contains("Reviews").click(); // EVO
        cy.get(".expandable-title").click();
        cy.get("#review").type("Den bästa boken.");
        cy.get("#isPublic").check();
        cy.get("#score").select("2");
        cy.get(".expandable-content button").click();
    });

    it("user can remove a review", () => {
        cy.contains("My new name").click();
        cy.get("#user-link").click();
        cy.contains("Reviews").click(); // EVO
        cy.contains("Liitu-ukko").click();
        cy.contains("I love this book. Amo questo libro. Ce livre, Je l'aime. Ich liebe diese Buch. Rakastan tätä kirjaa.");
        cy.contains("4");
        cy.get(".table-content .review-remove-button").eq(0).click();
        cy.contains("Liitu-ukko").should("not.exist");

        cy.contains("Imaginaerum");
    });

    it("another user (with whom shelf have been shared) can add records to shelf and edit them", () => {
        cy.get("#log-in-user-menu").click();
        cy.contains("Logout").click(); // EVO

        cy.get("#log-in-user-menu").click();
        cy.get("#username").type("adminuser");
        cy.get("#current-password").type("salasana");
        cy.get("#log-in-button").click();

        cy.get("#main-search-field").type("Imaginaerum");
        cy.get("#search-button").click();
        cy.contains("Imaginaerum").click();
        cy.contains("Average review score: 2.00");
        cy.contains("Reviews").click(); // EVO
        cy.contains("My new name");
        cy.contains("Den bästa boken.");

        cy.get("select").first().select("bettername");
        cy.contains("Add to shelf").click(); // EVO
        cy.get(".close-notification").first().click();
        cy.get("#log-in-user-menu").click();
        cy.get("#user-link").click();
        cy.contains("Shelves").click(); // EVO
        cy.contains("Shared with me").click(); // EVO
        cy.contains("bettername").click();
        cy.contains("Imaginaerum");
        cy.contains("Liitu-ukko");
        cy.contains("Lorem ipsum");
        cy.contains("Remove shelf").should("not.exist");

        cy.contains("Share with");
        cy.contains("Edit");
    });

    it("when user is not logged in, user can get public shelf", () => {
        cy.get("#log-in-user-menu").click();
        cy.contains("Logout").click(); // EVO

        cy.contains("Liitu-ukko");
        cy.contains("Imaginaerum");
        cy.contains("Edit").should("not.exist"); // EVO
        cy.contains("Remove").should("not.exist"); // EVO
        cy.contains("Remove").should("not.exist"); // EVO
        cy.contains("Remove shelf").should("not.exist"); // EVO
        cy.contains("Share with").should("not.exist"); // EVO
    });
});