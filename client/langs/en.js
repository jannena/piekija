
export default (slog, def) => {
    return {
        // Essentials
        "cancel-button": "Cancel",
        "save-button": "Save",
        "edit-button": "Edit",
        "delete-button": "Remove",
        "remove-button": "Remove",
        "search-button": "Search",
        "clear-button": "Clear",
        "renew-button": "Renew",
        "return-button": "Return",
        "create-button": "Create",

        // item states
        "not loaned": "Not loaned",
        "loaned": "Loaned",
        "not in use": "Not in use",
        "broken": "Broken",
        "placed a hold": "Placed a hold",
        "other": "Other",

        // Search.js
        "Error": "Error",
        "Givethesearchquery": "Give the search query",
        "sortbyyear": "Year (newest first)",
        "sortbyyeardesc": "Year (oldest first)",
        "sortbyalphapetical": "Alphapetical (A-Z)",
        "sortbyalphapeticaldesc": "Alphapetical (Z-A)",
        "sortbytimeadded": "Latest added first",
        "Previous": "",
        "Next": "",
        "Page": "",
        "No results": "",
        "Found": "",
        "records-in": "records",
        "in-before-milliseconds": "in",
        "in-milliseconds": "milliseconds",

        // AdvancedSearch.js
        "advancedsearch": "Advanced Search",
        "AddGROUP": "Add GROUP",
        "AddFIELD": "Add FIELD",
        "removethisgroup": "Remove this group",
        "withallthese(and)": "With all of these (and)",
        "withanyofthese(or)": "With any of these (or)",
        "is exactly": "is exactly",
        "is not": "is not",
        "is greater than": " is greater than",
        "is less than": "is less than",
        "everything": "",
        "content type": "",
        "title": "",
        "subject": "",
        "genre": "",
        "author": "",
        "year": "",
        "country": "",
        "standard code (ISBN/ISSN/...)": "",
        "series": "",
        "classification": "",
        "main language": "",
        "language": "any language",

        // Container.js
        "Frontpage": "Frontpage",
        "Search-menu": "Search",
        "Search-button": "Search",
        "Help": "Help",

        // FrontpageNews.js
        "Created on": "",
        "Updated on": "",

        // Login.js
        "Username": "",
        "Pasword": "",
        "Log in -button": "Log in",
        "Two-factor authentication code": "",

        // UserMenu.js
        "Log in": "",
        "You": "",
        "Staff": "",
        "Logout": "",

        // Record.js
        "Back": "",
        "Content type": "",
        "Series": "",
        "Appearance": "",
        "spelling": "",
        "Items": "",
        "MARC": "",
        "Links": "",

        // RecordTools.js
        "Add to shelf": "",
        "Edit record": "",

        // RecordAuthors.js
        "Authors": "",

        // RecordSubjects.js
        "Subjects": "",

        // RecordClassification.js
        "Classification": "",

        // RecordNotes.js
        "General note": "",
        "Contents": "",
        "Incomplete contents": "",
        "Partial contents": "",
        "Summary": "",
        "Subject": "",
        "Review": "",
        "Scope and content": "",
        "Abstract": "",
        "Content advice": "",
        "Other note (not named yet)": "",

        // RecordPublisherInfo.js
        "Production": "",
        "Publication": "",
        "Distribution": "",
        "Manufacture": "",
        "Copyright notice data": "",
        "Publisher": "",

        // RecordStandardCodes.j
        "Standard codes": "",
        "NO TYPE": "",

        // RecordTime.js
        "Currently published": "",
        "Ceased publishing": "",
        "Detailed date": "",
        "Dates unknown": "",
        "Questionable data": "",
        "BC": "",

        // RecordLanguages.js
        "Countries": "",
        "Main language": "",
        "Text language": "",
        "Language of summary or abstract": "",
        "Sung or spoken text language": "",
        "Language of table of contents": "",
        "Original language": "",
        "Subtitles language": "",
        "Intermediate translation languages": "",

        // Shelf.js
        "Public shelf": "",
        "you": "",
        "Description": "",
        "Author": "",
        "records-shelves": "Records",
        "Share with": "",

        // ShelfRecord.js
        "Record does not exist": "",

        // ShelfSharing.js
        "share-button": "Share",
        "unshare-button": "Unshare",
        "Shared with": "",
        "Share with...": "",

        // TFAForm.js
        "scan-qr-code-info": "Scan this QR code with Google Authenticator or other authenticator application.",
        "Current password": "",
        "Enabled": "",
        "Disabled": "",
        "Enable": "",
        "Disable": "",

        // UserInfo.js
        "Loans": "",
        "Shelves": "",
        "Holds": "",
        "Edit me": "",
        "Two-factor authentication": "",
        "My shelves": "",
        "Shared with me": "",
        "Create shelf": "",
        "Name": "",
        "New password": "",
        "New password again": "",
        "Old password": "",
        "new-password-info": "Leave empty if you do not want to change it.",

        // Staff.js
        "Forbidden!": "",
        "Welcome": "",
        "Records": "",
        "Locations": "",
        "Loantypes": "",
        "Users": "",
        "Circulation": "",
        "Notes": "",
        "Create empty record from template": "",
        "Add record by scanning EAN code": "",
        "ISBN or EAN": "",
        "Search external databases for this record": "",
        "View in Finna": "",
        "Preview": "",

        // Circulation.js
        "User barcode": "",
        "Barcode": "",
        "Name": "",
        "after-number-loans": "loans",
        "Show user": "",
        "Item barcode": "",
        "Title": "",
        "Location": "",
        "Loantype": "",
        "State": "",
        "Show record": "",
        "Loan item to": "",

        // Loan.js
        "Renew times left": "",
        "Due date": "",

        // MARCEditor.js
        "Fields in this record": "",
        "Add field": "",
        "back-to-top": "Top",
        "Save for preview": "",
        "Add subfield": "",
        "Remove field": "",

        // RecordItems.js
        "staff-item-barcode-info": "Unique code for every item",
        "Create new item": "",

        // StaffEditRecord.js
        "Save to database": "",
        "watching-preview-info": "You are watching record in preview mode. Record has not yet been saved to the database.",
        "cannot-remove-items-info": "All items attached to this record must be removed before removing the record.",
        "Remove this record": "",
        "items-tab": "Items",
        "preview-tab": "Preview",
        "simple-editor-tab": "Simple editor",
        "remove-tab": "",
        "MARC-tab": "",

        // StaffUser.js
        "Create new user": "",

        // StaffNotes.js
        "Create new note": "",
        "Title": "",
        "Content": "",

        // StaffLocations.js
        "Create new location": "",
        "Location name": "",
        "location-name-info": "Visible for all users",

        // StaffLoantypes.js
        "Create new loantype": "",
        "canBePlacedAHold": "Can be placed a hold",
        "canBeLoaned": "Can be loaned",
        "renewTimes": "Renew Times",
        "loanTime": "Loan time",
        "canBeLoaned-info": "If true, users cannot loan this item.",
        "renewTimes-info": "How many times item can be renewed. Cannot be renewed if 0.",
        "loanTime-info": "How many days the loan time is"
    }[slog] || def || slog;
};