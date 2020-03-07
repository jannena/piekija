
before(() => {
    cy.request("POST", "http://localhost:3001/debug/reset");
    cy.request("POST", "http://localhost:3001/debug/initrecords");
    cy.visit("http://localhost:3000");
    cy.get("#log-in-user-menu").click();
    cy.get("#username").type("adminuser");
    cy.get("#current-password").type("salasana");
    cy.get("#log-in-button").click();
    cy.get(".close-notification").first().click();
});

describe("record tests", () => {
    it("new record can be created from template", () => {
        cy.get("#log-in-user-menu").click();
        cy.get("#staff-link").click();
        cy.contains("Records").click(); // EVO
        cy.get("#ai").type(58);
        cy.get("#create-record-template").click();
        cy.contains("Record was saved to the database"); // EVO
        cy.contains("Title / subtitle : possible creators.");
    });

    it("items can be attached", () => {
        cy.contains("Items").click(); // EVO
        cy.get(".expandable-title").click();
        cy.get("#barcode").should("have.value", "58/1");
        cy.get("#loantype").select("This is a loantype");
        cy.get("#location").select("This is the second location");
        cy.get("#shelfLocation").clear().type("123 JOSS");
        cy.get("#state").select("not loaned");
        cy.get("#note").type("Floakshra krosum!");
        cy.get(".create-item-button").click();
        cy.get(".expandable-title").click();

        cy.contains("58/1");
        cy.contains("Not loaned");
    });

    it("items can be edited", () => {
        cy.contains("58/1").eq(0).click();
        cy.get(".edit-note").should("have.value", "Floakshra krosum!");
        cy.get(".edit-note").clear().type("Thank you!");
        cy.get(".edit-shelfLocation").should("have.value", "123 JOSS");
        cy.get(".edit-shelfLocation").clear().type("84.2 KIR");

        cy.get(".edit-location").select("This is a new location");
        cy.get(".edit-state").select("broken");

        cy.get(".save-item-button").click();
        cy.contains("Item was updated");

        cy.contains("58/1").eq(0).click();

        cy.get("#preview-as-user").click();
        cy.contains("Title / subtitle : possible creators.");
        cy.contains("This is a new location");
        cy.contains("Broken"); // EVO
        cy.contains("84.2 KIR");
        cy.contains("123 JOSS").should("not.exist");

        cy.get("#edit-record-button").click();
    });

    it("record cannot be removed when there are items attached to it", () => {
        cy.contains("Remove").click(); // EVO
        cy.contains("All items attached to this record must be removed before removing the record.");
        cy.contains("Remove this record").should("be.disabled");
    });

    it("items can be removed", () => {
        cy.contains("Items").click(); // EVO
        cy.contains("58/1").eq(0).click();
        cy.get(".remove-item-button").click();
        cy.contains("Item was removed"); // EVO
        cy.contains("58/1").should("not.exist");
    });

    it("MARC can be edited", () => {
        cy.contains("MARC").click(); // EVO

        cy.get("#MARC-field").type("979");
        cy.get("#add-MARC-field").click();

        cy.get(".MARC-subfield-979-0").clear().type("b");
        cy.get(".MARC-add-subfield-979-0").click();
        cy.get(".MARC-subfield-979-0").clear().type("c");
        cy.get(".MARC-add-subfield-979-0").click();
        cy.get(".MARC-field-979-0-subfield-b-0").type("Part I");
        cy.get(".MARC-field-979-0-subfield-c-0").type("The best friend of the author");

        cy.get(".MARC-field-245-0-subfield-a-0").clear().type("The Perks of Being a John Doe /");
        cy.get(".MARC-field-245-0-subfield-c-0").clear().type(" by a John doe");
        cy.get(".MARC-remove-subfield-245-0-subfield-b-0").click();

        cy.get(".MARC-field-100-0-subfield-a-0").clear().type("Doe, John, ");
        cy.get(".MARC-field-100-0-subfield-e-0").clear().type("ajohndoe");

        cy.get(".MARC-remove-field-700-0").click();

        cy.get("#open-008-editor").click();
        cy.get("#F008-3537").select("sme");
        cy.get("#F008-0710").clear().type("5575");
        cy.get(".save-008-button").click();

        cy.get("#save-MARC-button").click();
        cy.contains("Record was updated"); // EVO

        cy.get("#preview-as-user").click();
        cy.contains("The Perks of Being a John Doe /");
        cy.contains("by a John doe");
        cy.contains("Creator, Another").should("not.exist");
        cy.contains("5575");

        cy.contains("Doe, John, ");
        cy.contains("ajohndoe");

        cy.contains("Show more").click();
        cy.contains("Northern Sami");

        cy.contains("The best friend of the author").should("not.exist");
        cy.contains("Table of contents").click(); // EVO
        cy.contains("The best friend of the author")
        cy.contains("Part I");
    });

    it("record can be removed", () => {
        cy.get("#edit-record-button").click();
        cy.contains("Remove").click(); // EVO
        cy.contains("Remove this record").click(); // EVO
        cy.contains("Record was removed"); // EVO
        cy.contains("Create empty record from template"); // EVO
    });
});