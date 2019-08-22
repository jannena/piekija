
/*
 * 0: init
 * 1: loading
 * 2: success
 * 3: error
*/
const init = {
    record: {
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
    }
};

const loadingReducer = (state = init, action) => {
    const { type } = action;
    let [stateType = "", reducer = ""] = type.split("_");

    const updateToState = ["", "REQUEST", "SUCCESS", "FAILURE"].indexOf(stateType) || 3;

    switch (reducer) {
        case "SHELF":
            return {
                ...state,
                shelf: { state: updateToState, error: action.error || null }
            };
    }
    return state;
};

export default loadingReducer;