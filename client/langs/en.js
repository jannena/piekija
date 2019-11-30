
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

        "Advancedsearch": "Advanced Search",

        // Container.js
        "Frontpage": "Frontpage",
        "Search-menu": "Search",
        "Search-button": "Search",
        "Help": "Help"
    }[slog] || def || slog;
};