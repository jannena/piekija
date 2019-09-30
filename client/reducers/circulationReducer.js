import userService from "../services/userService";
import itemService from "../services/itemService";
import circulationService from "../services/circulationService";
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
        case "PSUCCESS_CIRCULATION_LOAN":
            return {
                ...state,
                item: {
                    ...state.item,
                    state: "loaned",
                    statePersonInCharge: action.result.item.statePersonInCharge,
                    stateDueDate: action.result.item.stateDueDate
                },
                user: !state.user ? state.user : {
                    ...state.user,
                    loans: state.user.loans.concat(state.item.id)
                }
            };
        case "PSUCCESS_CIRCULATION_RETURN":
            return {
                ...state,
                item: {
                    ...state.item,
                    state: "not loaned",
                    statePersonInCharge: null,
                    stateDueDate: null
                },
                user: !state.user ? state.user : {
                    ...state.user,
                    loans: state.user.loans.filter(l => l._id !== state.item.id)
                }
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

export const searchForUser = query => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_CIRCULATION_USER" });
    userService
        .search(query, getState().token.token)
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

export const loanItem = () => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_CIRCULATION_LOAN" });
    circulationService
        .loan(getState().circulation.item.id, getState().circulation.user.id, getState().token.token)
        .then(result => {
            dispatch({
                type: "PSUCCESS_CIRCULATION_LOAN",
                result
            });
        })
        .catch(onError(dispatch, "PFAILURE_CIRCULATION_LOAN"));
};

export const returnItem = () => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_CIRCULATION_RETURN" });
    circulationService
        .returnItem(getState().circulation.item.id, getState().token.token)
        .then(() => {
            dispatch({
                type: "PSUCCESS_CIRCULATION_RETURN"
            })
        })
        .catch(onError(dispatch, "PFAILURE_CIRCULATION_RETURN"))
};