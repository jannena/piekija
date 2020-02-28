
before(() => {
    cy.request("POST", "http://localhost:3001/debug/reset");
    cy.visit("http://localhost:3000");
    cy.get("#log-in-user-menu").click();
    cy.get("#username").type("adminuser");
    cy.get("#current-password").type("salasana");
    cy.get("#log-in-button").click();
    cy.contains("Admin User").click();
    cy.get("#staff-link").click();
});

describe("staff screens work", () => {
    it("locations can be created AND edited AND removed", () => {
        cy.contains("Locations").click(); // EVO

        // Creating
        cy.get(".expandable-title").click();
        cy.get("#name").type("This is my new location");
        cy.get(".expandable-content button").click();

        cy.get("#name").clear().type("This is my second location");
        cy.get(".expandable-content button").click();

        cy.get(".expandable-title").click();

        // cy.reload();

        // Modifying
        cy.contains("This is my new location").click();
        cy.get("input[value='This is my new location']").clear().type("Olipa kerran");
        cy.contains("Save").click(); // EVO
        cy.contains("Olipa kerran").first().click();

        cy.contains("This is my second location").click();
        cy.get("input[value='This is my second location']").clear().type("Minä olen minä");
        cy.get(".tabs .location-save-button").eq(1).click(); // EVO
        cy.contains("Minä olen minä").click();

        // cy.reload();

        // Removing
        cy.contains("Minä olen minä").click();
        cy.get(".tabs .location-remove-button").eq(1).click(); // EVO
        cy.contains("Minä olen minä").should("not.exist");

        cy.contains("Olipa kerran").click();
        cy.contains("Remove").click() // EVO
        cy.contains("Olipa kerra").should("not.exist")
    });

    it("loantypes can be created AND edited AND removed", () => {
        cy.contains("Loantypes").click(); // EVO

        // Creating
        cy.get(".expandable-title").click();
        cy.get("#name").type("This is my loantype");
        cy.get("#renewTimes").type("8");
        cy.get("#loanTime").type("64");
        cy.get("#canBePlacedAHold").check();
        cy.get("#canBeLoaned").check();
        cy.get(".expandable-content button").click();
        cy.get(".expandable-title").click();

        // cy.reload();

        // Modifying
        cy.contains("This is my loantype").click();
        cy.get(".table-content input[name='name']").clear().type("No it is not");
        cy.get(".table-content input[name='canBePlacedAHold']").uncheck();
        cy.get(".table-content input[name='canBeLoaned']").uncheck();
        cy.get(".table-content input[name='renewTimes']").clear().type("28008");
        cy.get(".table-content input[name='loanTime']").clear().type("224456");
        cy.get(".table-content .loantype-save-button").click(); // EVO
        cy.contains("No it is not").click();
        cy.contains("28008")
        cy.contains("false");
        cy.contains("true").should("not.exist");
        cy.contains("224456");

        // cy.reload();

        // Removing
        cy.contains("No it is not").click();
        cy.contains("Remove").click() // EVO
        cy.contains("No it is not").should("not.exist");
    });

    it("users can be created AND edited AND removed", () => {
        cy.contains("Users").click(); // EVO
        cy.contains("Create new user").click(); // EVO
        cy.contains("Edit").click(); // EVO
        cy.get("#name").clear().type("Tämä on minun nimeni");
        cy.get("#username").clear().type("myusername");
        cy.get("#barcode").clear().type("myusername");
        cy.get("#password").clear().type("1234567890");
        cy.contains("Save").click(); // EVO
        cy.contains("User was updated"); // EVO

        cy.contains("Loans").click(); // EVO
        cy.contains("Clear").click(); // EVO
        cy.get("input[name='barcode']").type("myusername");
        cy.get(".tabs form button").click();
        cy.contains("Tämä on minun nimeni");
        cy.contains("myusername");
        cy.contains("Loans: 0"); // EVO
        cy.contains("Holds: 0"); // EVO

        // TODO: Removing user
    });

    it("front page news can be created AND edited AND removed", () => {
        cy.contains("Notes").click(); // EVO

        // Creating
        cy.get(".expandable-title").click();
        cy.get("#title").type("This should be my second piece of news");
        cy.get("#content").type("Tervetuloa! Bienvenue! Benvenuto! Welcome! Willkommen! Välkommen!");
        cy.get(".expandable-content button").click(); // EVO
        cy.get(".expandable-title").click();
        // cy.contains("This should be my second piece of news");

        // cy.reload();

        // Modifying
        cy.contains("This should be my second piece of news").click();
        cy.get(".table-content input[name='title']").eq(1).clear().type("Are you sure?");
        cy.get(".table-content textarea").eq(1).clear().type("Eri kielillä tervetuloa!");
        cy.get(".table-content .note-save-button").eq(1).click(); // EVO
        cy.contains("This should be my second piece of news").should("not.exist");

        // cy.reload();

        // Removing
        cy.contains("This is the first note").click();
        cy.get(".table-content .note-remove-button").eq(0).click(); // EVO
        cy.contains("This is the first note").should("not.exist");

        cy.get("#log-in-user-menu").click();
        cy.contains("Logout").click(); // EVO
    });

    it("new front page news can bee seen and user created earlier can log in", () => {
        cy.contains("Frontpage").click(); // EVO
        cy.contains("This is the first note").should("not.exist");
        cy.contains("Eri kielillä tervetuloa!");
        cy.contains("Are you sure?");

        cy.get("#log-in-user-menu").click();
        cy.get("#username").type("myusername");
        cy.get("#current-password").type("1234567890");
        cy.get("#log-in-button").click();
        cy.contains("Tämä on minun nimeni");
    });
});