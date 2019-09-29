import userService from "../services/userService";
import itemService from "../services/itemService";
import { onError } from "./errorHandingHelper";

const init = {
    user: null,
    item: null
};

const circulationReducer = (state = init, action) => {
    switch (action.type) {
        case "PSUCCESS_CIRCULATION_USER":
            return {
                ...state,
                user: action.user
            };
        case "PSUCCESS_CIRCULATION_ITEM":
            return {
                ...state,
                item: action.item
            };
        case "CLEAR_ITEM":
            return {
                ...state,
                item: null
            };
        case "CLEAR_USER":
            return {
                ...state,
                user: null
            };
    }
    return state;
};

export default circulationReducer;

export const searchForUser = barcode => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_CIRCULATION_USER" });
    userService
        .search(barcode, getState().token.token)
        .then(user => {
            dispatch({
                type: "PSUCCESS_CIRCULATION_USER",
                user: user[0]
            });
        })
        .catch(onError(dispatch, "PFIALURE_CIRCULATION_USER"));
};

export const searchForItem = barcode => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_CIRCULATION_ITEM" });
    itemService
        .search(barcode, getState().token.token)
        .then(item => {
            dispatch({
                type: "PSUCCESS_CIRCULATION_ITEM",
                item
            });
        })
        .catch(onError(dispatch, "PFIALURE_CIRCULATION_ITEM"));
};

export const clearItem = () => dispatch => dispatch({ type: "CLEAR_ITEM" });
export const clearUser = () => dispatch => dispatch({ type: "CLEAR_USER" });