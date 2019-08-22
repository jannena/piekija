
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
    let [stateType, reducer, ...rest] = type.split("_");
    // const splittedType = /(REQUEST|SUCCESS|FAILURE)_(.*)/.exec(type);
    // if (splittedType) console.log(splittedType);

    switch (action.type) {
        case "REQUEST_SHARE":
        case "REQUEST_UNSHARE":
        case "REQUEST_GET_SHELF":
        case "REQUEST_ADD_RECORD":
        case "REQUEST_UPDATE_RECORD":
        case "REQUEST_REMOVE_RECORD":
            return { ...state, shelf: 1 }
    }
    return state;
};

export default loadingReducer;