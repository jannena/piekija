
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

        // Item states
        "not loaned": "Not loaned",
        "loaned": "Loaned",
        "not in use": "Not in use",
        "broken": "Broken",
        "placed a hold": "Placed a hold",
        "other": "Other",

        // Content types
        "a": "Language material",
        "c": "Notated music",
        "d": "Manuscript notated music",
        "e": "Cartographic material",
        "f": "Manuscript cartographic material",
        "g": "Projected medium",
        "i": "Nonmusical sound recording",
        "j": "Musical sound recording",
        "k": "Two-dimensional nonprojectable graphic",
        "m": "Computer file",
        "o": "Kit",
        "p": "Mixed materials",
        "r": "Three-dimensional artifact or naturally occurring object",
        "t": "Manuscript language material",

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

        // SearchFilter.js
        "cannot-use-search-filter": "Filter cannot be used in this search.",
        "Filter search": "",
        "Years": "",
        "Languages": "",

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
        "Statistics": "",
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
        "circulation-for": "for",

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
        "staff-item-shelf-location-info": "Location in shelf, e.g. classification and author name (84.2 TUD)",
        "staff-item-state-info": "Do not change if state is 'Loaned'.",
        "Create new item": "",
        "Last loaned": "",
        "Shelf location": "",
        "Note": "",

        // StaffEditRecord.js
        "Save to database": "",
        "watching-preview-info": "You are watching record in preview mode. Record has not yet been saved to the database.",
        "cannot-remove-items-info": "All items attached to this record must be removed before removing the record.",
        "Remove this record": "",
        "items-tab": "Items",
        "preview-tab": "Preview",
        "simple-editor-tab": "Simple editor",
        "remove-tab": "Remove",
        "MARC-tab": "MARC",
        "Back to staff screen": "",
        "Preview as normal user": "",

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
        "Loan times": "",

        // StaffLoantypes.js
        "Create new loantype": "",
        "canBePlacedAHold": "Can be placed a hold",
        "canBeLoaned": "Can be loaned",
        "renewTimes": "Renew Times",
        "loanTime": "Loan time",
        "canBeLoaned-info": "If false, users cannot loan this item.",
        "renewTimes-info": "How many times item can be renewed. Cannot be renewed if 0.",
        "loanTime-info": "How many days the loan time is",

        // Statistics.js
        "Date since item has not been loaned": "",
        "Not loaned since": "",
        "Total loans": "",
        "Download CSV": "",
        "How many things in total": "",
        "more-statistics-info": "More statistics can be received in each location an item record.",
        "Date": "",
        "Get": "",
        "items": "",

        // ShowMore.js
        "Show more": "",
        "Hide": ""
    }[slog] || def || slog;
};