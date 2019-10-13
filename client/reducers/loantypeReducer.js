import loantypeService from "../services/loantypeService";
import { onError } from "./errorHandingHelper";


const loantypeReducer = (state = [], action) => {
    switch (action.type) {
        case "SUCCESS_LOANTYPE_GET":
            return action.loantypes;
        case "PSUCCESS_LOANTYPE_CREATE":
            return state.concat(action.loantype);
        case "PSUCCESS_LOANTYPE_UPDATE":
            return state.map(l => action.loantype.id !== l.id ? l : action.loantype);
        case "PSUCCESS_LOANTYPE_REMOVE":
            return state.filter(l => l.id !== action.loantype)
    }
    return state;
};

export default loantypeReducer;

export const createLoantype = (name, canBePlacedAHold, canBeLoaned, renewTimes, loanTime) => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_LOANTYPE_CREATE" });
    loantypeService
        .create(name, canBePlacedAHold, canBeLoaned, renewTimes, loanTime, getState().token.token)
        .then(loantype => {
            dispatch({
                type: "PSUCCESS_LOANTYPE_CREATE",
                loantype
            });
        })
        .catch(onError(dispatch, "PFAILURE_LOANTYPE_CREATE"));
};

export const getLoantypes = () => (dispatch, getState) => {
    dispatch({ type: "REQUEST_LOANTYPE_GET" });
    loantypeService
        .getAll(getState().token.token)
        .then(loantypes => {
            dispatch({
                type: "SUCCESS_LOANTYPE_GET",
                loantypes
            });
        })
        .catch(onError(dispatch, "FAILURE_LOANTYPE_GET"));
};

export const removeLoantype = id => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_LOANTYPE_REMOVE" });
    loantypeService
        .remove(id, getState().token.token)
        .then(() => {
            dispatch({
                type: "PSUCCESS_LOANTYPE_REMOVE",
                loantype: id
            });
        })
        .catch(onError(dispatch, "PFAILURE_LOANTYPE_REMOVE"));
};

export const updateLoantype = (id, name, canBePlacedAHold, canBeLoaned, renewTimes, loanTime) => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_LOANTYPE_UPDATE" });
    loantypeService
        .update(id, name, canBePlacedAHold, canBeLoaned, renewTimes, loanTime, getState().token.token)
        .then(loantype => {
            dispatch({
                type: "PSUCCESS_LOANTYPE_UPDATE",
                loantype
            });
        })
        .catch(onError(dispatch, "PFAILURE_LOANTYPE_UPDATE"));
};