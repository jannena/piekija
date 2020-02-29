
/*
 * 0: init
 * 1: loading
 * 2: success
 * 3: error
 * 4: partial loading
 * 5: partial success
 * 6: partial error
*/
const init = {
    record: {
        state: 0,
        error: null
    },
    location: {
        state: 0,
        error: null
    },
    loantype: {
        state: 0,
        error: null
    },
    shelf: {
        state: 0,
        error: null
    },
    search: {
        state: 0,
        error: null
    },
    login: {
        state: 0,
        error: null
    },
    circulation_user: {
        state: 0,
        error: null
    },
    circulation_item: {
        state: 0,
        error: null
    },
    circulation_holds: {
        state: 0,
        error: null
    },
    user: {
        state: 0,
        error: null
    },
    statistics: {
        state: 0,
        error: null
    },
    others: {},
    loading: 0
};

const loadingReducer = (state = init, action) => {
    const { type } = action;
    let [stateType = "", reducer = "", ...restActionName] = type.split("_");

    const actionName = restActionName.join("");

    const updateToState = ["", "REQUEST", "SUCCESS", "FAILURE", "PREQUEST", "PSUCCESS", "PFAILURE"].indexOf(stateType) || 3;

    const loading = state.loading + (() => {
        if ([1, 4].indexOf(updateToState) !== -1) return 1;
        if ([2, 3, 5, 6].indexOf(updateToState) !== -1) return -1;
        return 0;
    })();

    /* return {
        ...state,
        [reducer + "_" + actionName]: {
            state: loading,
            error: action.error || null
        },
        [reducer]: {
            state: loading,
            error: action.error || null
        },
        loading
    }; */

    switch (reducer) {
        case "SHELF":
            return {
                ...state,
                shelf: { state: updateToState, error: action.error || null },
                loading
            };
        case "SEARCH":
            return {
                ...state,
                search: { state: updateToState, error: action.error || null },
                loading
            };
        case "RECORD":
            return {
                ...state,
                record: { state: updateToState, error: action.error || null },
                loading
            };
        case "STATISTICS":
            return {
                ...state,
                statistics: { state: updateToState, error: action.error || null },
                loading
            };
        case "LOCATION":
            return {
                ...state,
                location: { state: updateToState, error: action.error || null },
                loading
            };
        case "LOANTYPE":
            return {
                ...state,
                loantype: { state: updateToState, error: action.error || null },
                loading
            };
        case "CIRCULATION":
            if (actionName.includes("HOLDS")) return {
                ...state,
                circulation_holds: { state: updateToState, error: action.error || null },
                loading
            }
            else if (actionName.includes("USER")) return {
                ...state,
                circulation_user: { state: updateToState, error: action.error || null },
                loading
            }
            else if (actionName.includes("ITEM")) return {
                ...state,
                circulation_item: { state: updateToState, error: action.error || null },
                loading
            }
    }
    return state;
};

export default loadingReducer;