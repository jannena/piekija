
export default (slog, def) => {
    return {
        "Error": "Virhe",
        "Givethesearchquery": "Anna hakulauseke",
        "Advancedsearch": "Tarkennettu haku"
    }[slog] || def || slog;
};