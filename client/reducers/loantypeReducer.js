import loantypeService from "../services/loantypeService";
import { onError } from "./errorHandingHelper";


const loantypeReducer = (state = [], action) => {
    switch (action.type) {
        case "SUCCESS_LOANTYPE_GET":
            return action.loantypes;
        case "SUCCESS_LOANTYPE_CREATE":
            return state.concat(action.loantype);
        case "SUCCESS_LOANTYPE_UPDATE":
        case "SUCCESS_LOANTYPE_REMOVE":
    }
    return state;
};

export default loantypeReducer;

export const createLoantype = (name, canBePlacedAHold, canBeLoaned, canBeRenewed, renewTimes, loanTime) => (dispatch, getState) => {
    dispatch({ type: "REQUEST_LOANTYPE_CREATE" });
    loantypeService
        .create(name, canBePlacedAHold, canBeLoaned, canBeRenewed, renewTimes, loanTime, getState().token.token)
        .then(loantype => {
            dispatch({
                type: "SUCCESS_LOANTYPE_CREATE",
                loantype
            });
        })
        .catch(onError(dispatch, "FAILURE_LOANTYPE_CREATE"));
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