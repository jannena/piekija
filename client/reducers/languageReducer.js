
const languageReducer = (state = "en", action) => {
    switch (action.type) {
        case "SET_LANGUAGE":
            return action.language;
    }
    return state;
};

export default languageReducer;

export const setLanguage = language => dispatch => {
    dispatch({
        type: "SET_LANGUAGE",
        language
    });
};