
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
    user: {
        state: 0,
        error: null
    },
    statistics: {
        state: 0,
        error: null
    },
    loading: 0
};

const loadingReducer = (state = init, action) => {
    const { type } = action;
    let [stateType = "", reducer = ""] = type.split("_");

    const updateToState = ["", "REQUEST", "SUCCESS", "FAILURE", "PREQUEST", "PSUCCESS", "PFAILURE"].indexOf(stateType) || 3;

    const loading = state.loading + (() => {
        if ([1, 4].indexOf(updateToState) !== -1) return 1;
        if ([2, 3, 5, 6].indexOf(updateToState) !== -1) return -1;
        return 0;
    })();

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
    }
    return state;
};

export default loadingReducer;