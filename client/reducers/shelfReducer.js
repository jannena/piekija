import shelfService from "../services/shelfService";

const shelfReducer = (state = null, action) => {
    switch (action.type) {
        case "SHARE":
        case "UNSHARE":
        case "ADD_RECORD":
        case "REMOVE_RECORD":
        case "UPDATE_RECORD":
    }
    return state;
};

export default shelfReducer;

export const createShelf = (name, publicity) => (dispatch, getState) => {
    shelfService
        .create(name, "", publicity, getState().token.token)
        .then(response => {
            dispatch({
                type: "CREATE_SHELF",
                shelf: response
            });
        })
        .catch(err => {});
};

export const addRecordToShelf = (shelf, record) => (dispatch, getState) => {
    shelfService
        .addRecord(shelf, record, getState().token.token)
        .then(response => {})
        .catch(err => {});
};