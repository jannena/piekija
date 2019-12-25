import statisticsService from "../services/statisticsService";
import { onError } from "./errorHandingHelper";

const INIT = {
    total: null,
    notLoanedSince: null
};

const statisticsReducer = (state = INIT, action) => {
    switch (action.type) {
        case "PSUCCESS_STATISTICS_TOTAL":
            return { ...state, total: action.total };
        case "PSUCCESS_STATISTICS_TOTALLOANS":
            return { ...state, totalLoans: action.data };
        case "PSUCCESS_STATISTICS_SINCE":
            return { ...state, notLoanedSince: action.data };
    }
    return state;
};

export default statisticsReducer;

export const getTotal = () => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_STATISTICS_TOTAL" });
    statisticsService
        .total(getState().token.token)
        .then(total => {
            dispatch({
                type: "PSUCCESS_STATISTICS_TOTAL",
                total
            })
        })
        .catch(onError(dispatch, "PFAILURE_STATISTICS_TOTAL"))
};

export const getTotalLoans = () => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_STATISTICS_TOTALLOANS" });
    statisticsService
        .totalLoans(getState().token.token)
        .then(data => {
            dispatch({
                type: "PSUCCESS_STATISTICS_TOTALLOANS",
                data
            })
        })
        .catch(onError(dispatch, "PFAILURE_STATISTICS_TOTALLOANS"));
};

export const getNotLoanedSince = (location, shelfLocation, date, language) => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_STATISTICS_SINCE" });
    statisticsService
        .notLoanedSince(location, shelfLocation, date, language, getState().token.token)
        .then(data => {
            dispatch({
                type: "PSUCCESS_STATISTICS_SINCE",
                data
            })
        })
        .catch(onError(dispatch, "PFAILURE_STATISTICS_SINCE"))
};