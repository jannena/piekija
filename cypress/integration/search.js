
/*
These tests tests (user is not logged in)
- basic search
- advanced search
- advanced and basic search filtering
- advanced and basic search sorting
- that record screen works
*/


before(() => {
    cy.request("POST", "http://localhost:3001/debug/reset");
    cy.visit("http://localhost:3000/");
});

describe("search works", () => {
    it("basic search (only one result)", () => {
        cy.get("#main-search-field").type("ImAgiNAErUM");
        cy.get("#search-button").click();
        cy.contains("Nightwish");
        cy.contains("2011");
        cy.contains("Liitu-ukko").should("not.exist");
        cy.contains("Tudor").should("not.exist");
        cy.contains("Imaginaerum").click();
        cy.contains("0.00");
        cy.contains("Imaginaerum / Nightwish");
        cy.contains("kelttiläinen kansanmusiikki")

        // Only English version
        cy.contains("Show more").click();
        cy.contains("Marco Hietala");
        cy.contains("Hide");
        cy.contains("MARC").click();
        cy.contains("Reviews").click();
        cy.contains("spelling").click();
        cy.contains("Items").click();

        cy.get("#menu-search-link").click();

        cy.contains("Filter search").click();
        cy.contains("Show more").click();
        cy.contains("kelttiläinen kansanmusiikki").click();
        cy.contains("Nightwish");

        cy.get(".expandable-title").first().click();
        cy.get(".advanced-search-group .advanced-search-remove-field").eq(1).click();
        cy.get(".advanced-search-button").click();
        cy.contains("Nightwish");
    });

    it("advanced search works", () => {
        cy.get("#menu-search-link").click();
        // cy.get(".expandable-title").first().click();

        cy.get(".advanced-search-group .advanced-search-remove-field").click();

        // Only English version
        cy.contains("Add GROUP").click();
        cy.contains("Remove this group").click();
        cy.contains("Remove this group").should("not.exist");


        cy.get(".advanced-search-group .advanced-search-add-field").first().click();
        cy.get(".advanced-search-group .advanced-search-operator").first().select("year");
        cy.get(".advanced-search-group .advanced-search-verb").first().select("lt");
        cy.get(".advanced-search-group .advanced-search-value").first().type("2020");

        cy.contains("Add GROUP").click();
        cy.get(".advanced-search-group .advanced-search-group .advanced-search-group-verb").select("OR");
        cy.get(".advanced-search-group .advanced-search-group .advanced-search-add-field").click();
        cy.get(".advanced-search-group .advanced-search-group .advanced-search-add-field").click();
        cy.get(".advanced-search-group .advanced-search-group .advanced-search-operator").eq(0).select("title");
        cy.get(".advanced-search-group .advanced-search-group .advanced-search-value").eq(0).type("Imaginaerum")
        cy.get(".advanced-search-group .advanced-search-group .advanced-search-operator").eq(1).select("title");
        cy.get(".advanced-search-group .advanced-search-group .advanced-search-value").eq(1).type("Liitu-ukko");

        cy.get(".advanced-search-button").click();

        cy.contains("Found 2 records");
        cy.contains("Liitu-ukko").click();
        cy.contains("Liitu-ukko / C. J. Tudor ; suomentanut Raimo Salminen.");
        cy.contains("aikatasot");
        cy.contains("1986");
        cy.contains("2016");
        cy.contains("Reviews").click();
        cy.contains("Write a review");
        cy.contains("MARC").click();
        cy.contains("Items").click();

        cy.get("#menu-search-link").click();
        cy.contains("Imaginaerum").click();
        cy.contains("Imaginaerum / Nightwish.");

        cy.contains("< Back").click();
        cy.contains("Filter search").click();
        cy.contains("Show more").click();
        cy.contains("jännityskirjallisuus (1)").click();
        cy.contains("Liitu-ukko");
        cy.contains("Tudor");
        cy.contains("Nightwish").should("not.exist");
        cy.contains("Found 1 records");
        cy.contains("Found 2 records").should("not.exist");
        cy.contains("2011").should("not.exist");

        cy.contains("Advanced Search").click();
        cy.get(".advanced-search-group .advanced-search-remove-field").eq(3).click();
        cy.get(".advanced-search-button").click();

        cy.contains("Nightwish");

        cy.get(".sort-select").select("alphapeticaldesc"); // TODO
    });
});