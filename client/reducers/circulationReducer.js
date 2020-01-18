import userService from "../services/userService";
import itemService from "../services/itemService";
import circulationService from "../services/circulationService";
import { onError } from "./errorHandingHelper";
import { notify } from "./notificationReducer";

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
            const newItem = {
                ...state.item,
                state: "loaned",
                statePersonInCharge: action.result.item.statePersonInCharge,
                stateDueDate: action.result.item.stateDueDate
            };
            return {
                ...state,
                item: newItem,
                user: !state.user ? state.user : {
                    ...state.user,
                    loans: state.user.loans.concat(newItem)
                }
            };
        case "PSUCCESS_CIRCULATION_RETURN":
            return {
                ...state,
                item: state.item && state.item.id === action.returned ? {
                    ...state.item,
                    state: "not loaned",
                    statePersonInCharge: null,
                    stateDueDate: null,
                    stateTimesRenewed: null
                } : state.item,
                user: !state.user ? state.user : {
                    ...state.user,
                    loans: state.user.loans.filter(l => l.id !== action.returned)
                }
            };
        case "PSUCCESS_CIRCULATION_RENEW":
            return {
                ...state,
                item: state.item && state.item.id === action.item ? {
                    ...state.item,
                    stateDueDate: action.dueDate,
                    stateTimesRenewed: state.item.stateTimesRenewed + 1
                } : state.item,
                user: !state.user ? state.user : {
                    ...state.user,
                    loans: state.user.loans.map(l => l.id !== action.item ? l : {
                        ...l,
                        dueDate: action.dueDate,
                        stateTimesRenewed: l.stateTimesRenewed + 1
                    })
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
        case "PSUCCESS_CIRCULATION_CREATE_USER":
            return {
                ...state,
                user: action.user
            };
        case "PSUCCESS_CIRCULATION_UPDATE_USER":
            return {
                ...state,
                user: { ...action.user, loans: state.user && state.user.loans }
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

export const createUser = () => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_CIRCULATION_CREATE_USER" });
    userService
        .create(getState().token.token)
        .then(result => {
            console.log(result);
            dispatch({
                type: "PSUCCESS_CIRCULATION_CREATE_USER",
                user: result
            });
            dispatch(notify("success", "User was created"));
        })
        .catch(onError(dispatch, "PFAILURE_CIRCULATION_CREATE_USER"));
}

export const updateUser = (name, username, barcode, password/* , address, email, phone */) => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_CIRCULATION_UPDATE_USER" });
    userService
        .update(getState().circulation.user.id, name, username, barcode, password, null, null, null, getState().token.token)
        .then(result => {
            dispatch({
                type: "PSUCCESS_CIRCULATION_UPDATE_USER",
                user: result
            });
            dispatch(notify("success", "User was updated"));
        })
        .catch(onError(dispatch, "PFAILURE_CIRCULATION_UPDATE_USER"));
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

export const returnItemWithId = id => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_CIRCULATION_RETURN" });
    circulationService
        .returnItem(id, getState().token.token)
        .then(() => {
            dispatch({
                type: "PSUCCESS_CIRCULATION_RETURN",
                returned: id
            });
            dispatch(notify("success", "Item was returned"));
        })
        .catch(onError(dispatch, "PFAILURE_CIRCULATION_RETURN"));
};

export const returnItem = () => (dispatch, getState) => dispatch(returnItemWithId(getState().circulation.item.id));

export const renewItemWithId = id => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_CIRCULATION_RENEW" });
    circulationService
        .renew(id, getState().token.token)
        .then(result => {
            dispatch({
                type: "PSUCCESS_CIRCULATION_RENEW",
                item: result.id,
                dueDate: result.dueDate
            });
            console.log("renewed item", result);
            dispatch(notify("success", "Item was renewed"));
        })
        .catch(onError(dispatch, "PFAILURE_CIRCULATION_RENEW"));
};

export const renewItem = () => (dispatch, getState) => dispatch(renewItemWithId(getState().circulation.item.id));