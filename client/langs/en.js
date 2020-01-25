
export default (slog, def) => {
    return {
        // Title
        "PieKiJa": "",

        // Date formats
        "date-format": d => `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`,
        "time-format": d => `${d.getHours()}:${("0" + d.getMinutes()).slice(-2)}:${("0" + d.getSeconds()).slice(-2)}`,

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
        "add-button": "Add",

        // Titles
        "title-Frontpage": "Frontpage",
        "title-Login": "Login",
        "title-User": "User",
        "title-Shelf": "Shelf",
        "title-Search": "Search",
        "title-Staff": "Staff",

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

        // A few languages
        "lang-fin": "Finnish",
        "lang-swe": "Swedish",
        "lang-eng": "English",
        "lang-fre": "French",
        "lang-spa": "Spanish",
        "lang-ita": "Italian",
        "lang-ger": "German",
        "lang-rus": "Russian",
        "lang-lat": "Latin",
        "lang-dan": "Danish",
        "lang-nor": "Norwegian",
        "lang-est": "Estonian",
        "lang-por": "Portuguese",
        "lang-hun": "Hungarian",
        "lang-dut": "Dutch",
        "lang-ice": "Icelandic",
        "lang-lav": "Latvian",

        "lang-smi": "Sami",
        "lang-sma": "Southern Sami",
        "lang-sme": "Northern Sami",
        "lang-smj": "Lule Sami",
        "lang-smn": "Inari Sami",
        "lang-sms": "Skolt Sami",

        "lang-chi": "Chinese",
        "lang-kor": "Korean",
        "lang-jpn": "Japanese",
        "lang-hin": "Hindi",
        "lang-ara": "Arabic",
        "lang-tha": "Thai",
        "lang-heb": "Hebrew",

        "lang-sgn": "Sign languages",
        "lang-mul": "Multiple languages",
        "lang-zxx": "No linguistic content",

        // A few countries
        "coun-fi ": "Finland",
        "coun-sw ": "Sweden",
        "coun-xxu": "The United States",
        "coun-xxk": "The United Kingdom",
        "coun-fr ": "France",
        "coun-it ": "Italy",
        "coun-gw ": "Germany",
        "coun-ru ": "Russia",
        "coun-no ": "Norway",
        "coun-dk ": "Denmark",
        "coun-er ": "Estonia",
        "coun-po ": "Portugal",
        "coun-hu ": "Hungary",
        "coun-ne ": "The Netherlands",
        "coun-be ": "Belgium",
        "coun-ic ": "Iceland",
        "coun-lv ": "Latvia",
        "coun-cc ": "China",
        "coun-ja ": "Japan",
        "coun-xx ": "No place, unknown, or undetermined",

        // Notifications
        "Passwords do not match!": "",
        "User was created": "",
        "User was updated": "",
        "Item was returned": "",
        "Item was renewed": "",
        "Record was updated": "",
        "Record was removed": "",
        "Record was saved to the database": "",
        "Item was updated": "",
        "Item was removed": "",
        "Shelf was created": "",
        "Shelf was updated": "",
        "Record was added to the shelf": "",
        "Note was updated": "",
        "Record was removed from the shelf": "",
        "Publicity, description or title was updated by": "",
        "Shelf was removed by": "",
        "A new record was added to the shelf by": "",
        "Record was remove from the shelf by": "",
        "A note was updated by": "",
        "Shelf was shared with somebody by": "",
        "Shelf was unshared with somebody by": "",
        "Logged in": "",
        "User infomation was updated": "",
        "Two-factor authentication was enabled": "",
        "Two-factor authentication was disabled": "",

        "there are items that using this loantype": "",
        "there are items using this location": "",
        "there are items attached to this record": "",
        "user have active loans": "",

        "user does not exist": "",
        "item does not exist": "",
        "item cannot be loaned because of loantype": "",
        "user has already loaned this item": "",
        "item has already been loaned": "",
        "item is missing": "",
        "item has not been loaned": "",
        "renewTimes exeeded": "",

        "barcode or record or location or loantype or state or shelfLocation is missing": "",
        "record does not exist": "",
        "location or loantype or state or note or shelfLocation is missing": "",
        "item is loaned to a user": "",
        "barcode is missing": "",
        "name or canBePlacedAHold or canBeLoaned or renewTimes or loanTime is missing": "",
        "name or canBePlacedAHold or canBeLoaned or renewTimes or loanTime is missing": "",

        "name is missing": "",

        "username or password is missing": "",
        "code needed": "",
        "invalid code": "",

        "title or content missing": "",

        "type or data is missing": "",
        "invalid marc21 data": "",

        "name or public is missing": "",
        "record is missing": "",
        "record has already been added to this shelf": "",
        "record or note is missing": "",
        "username is missing": "",
        "already shared with this user": "",
        "cannot share with the author": "",
        "user not found": "",

        "location or date is missing": "",

        "name and password and tfa are missing": "",
        "oldPassword is missing": "",
        "wrong oldPassword": "",
        "tfa must be true or false": "",
        "password too short": "",
        "name or username or staff or password or barcode is missing": "",
        "length of password must be at least 10 characters": "",
        "barcode and name missing": "",

        "invalid token": "",
        "malformatted id": "",
        "something must be unique": "",
        "you must login first": "",
        "you do not have permission to do that": "",
        "unknown endpoint": "",

        // app.js
        "Not found": "Page not found",

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
        "Remove field": "",
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
        "Welcome": "",
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
        "Go to admin panel": "",
        "record corrupted or not found": "",

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
        "Copyright notice date": "",
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
        "About shelf": "",
        "Remove shelf": "",
        "remove-shelf-confirmation": "Write the name of this shelf and press remove",
        "remove-shelf-not-possible": "This shelf can be removed only by the owner",

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
        "You logged out succefully": "",
        "Back to frontpage": "",
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
        "Sequential number (optional)": "",

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

        "Record status": "",
        "Type of record": "",
        "Bibliographic level": "",
        "Encoding level": "",
        "Descriptive cataloging form": "",
        "Multipart resource record level": "",

        "LEADER05-a": "Increase in encoding level",
        "LEADER05-c": "Corrected or revised",
        "LEADER05-d": "Deleted",
        "LEADER05-n": "New",
        "LEADER05-p": "Increase in encoding level from prepublication",

        "LEADER07-a": "Monographic component part",
        "LEADER07-b": "Serial component part",
        "LEADER07-c": "Collection",
        "LEADER07-d": "Subunit",
        "LEADER07-i": "Integrating resource",
        "LEADER07-m": "Monograph/Item",
        "LEADER07-s": "Serial",

        "LEADER17- ": "Full level",
        "LEADER17-1": "Full level, material not examined",
        "LEADER17-2": "Less-than-full level, material not examined",
        "LEADER17-3": "Abbreviated level",
        "LEADER17-4": "Core level",
        "LEADER17-5": "Partial (preliminary) level",
        "LEADER17-7": "Minimal level",
        "LEADER17-8": "Prepublication level",
        "LEADER17-u": "Unknown",
        "LEADER17-z": "Not applicable",

        "LEADER18- ": "Non-ISBD",
        "LEADER18-a": "AACR 2",
        "LEADER18-c": "ISBD punctuation omitted",
        "LEADER18-i": "ISBD punctuation included",
        "LEADER18-n": "Non-ISBD punctuation omitted",
        "LEADER18-u": "Unknown",

        "LEADER19- ": "Not specified or not applicable",
        "LEADER19-a": "Set",
        "LEADER19-b": "Part with independent title",
        "LEADER19-c": "Part with dependent title",

        "Type of date/Production status": "",
        "Date 1": "",
        "Date 2": "",
        "Place of publication, production, or execution": "",
        "Language": "",

        "F00806-b": "No dates given; B.C. date involved",
        "F00806-c": "Continuing resource currently published",
        "F00806-d": "Continuing resource ceased publication",
        "F00806-e": "Detailed date",
        "F00806-i": "Inclusive dates of collection",
        "F00806-k": "Range of years of bulk of collection",
        "F00806-m": "Multiple dates",
        "F00806-n": "Dates unknown",
        "F00806-p": "Date of distribution/release/issue and production/recording session when different",
        "F00806-q": "Questionable date",
        "F00806-r": "Reprint/reissue date and original date",
        "F00806-s": "Single known date/probable date",
        "F00806-t": "Publication date and copyright date",
        "F00806-u": "Continuing resource status unknown",
        "F00806-|": "No attempt to code",

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
        "Password": "",

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
        "Hide": "",

        // SimpleRecordEditor.js
        "Basic information": "",
        "Add author": "",
        "Add title": "",
        "Add ISBN": "",
        "Add EAN": "",
        "Main author": "",
        "Other authors": "",
        "personal": "",
        "corporate": "",
        "Sub-title": "",
        "Year": ""
    }[slog] || def || slog;
};