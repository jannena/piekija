
export default (slog, def) => {
    return {
        // Search.js
        "Error": "Error",
        "Givethesearchquery": "Give the search query",
        "sortbyyear": "Year (newest first)",
        "sortbyyeardesc": "Year (oldest first)",
        "sortbyalphapetical": "Alphapetical (A-Z)",
        "sortbyalphapeticaldesc": "Alphapetical (Z-A)",
        "sortbytimeadded": "Latest added first",

        // AdvancedSearch.js
        "advancedsearch": "Advanced Search",
        "AddGROUP":"Add GROUP",
        "AddFIELD":"Add FIELD",
        "removethisgroup":"Remove this group",
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

        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
    }[slog] || def || slog;
};