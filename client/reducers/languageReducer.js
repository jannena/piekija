
const INIT = localStorage.getItem("piekija-language") || "en";

const languageReducer = (state = INIT, action) => {
    switch (action.type) {
        case "SET_LANGUAGE":
            return action.language;
    }
    return state;
};

export default languageReducer;

export const setLanguage = language => dispatch => {
    localStorage.setItem("piekija-language", language);
    dispatch({
        type: "SET_LANGUAGE",
        language
    });
};