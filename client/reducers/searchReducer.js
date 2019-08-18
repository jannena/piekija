import searchService from "../services/searchService";
import { notify } from "./notificationReducer";

const init = {
    searches: {},
    result: {
        result: [],
        time: 0,
        found: 0
    }
};

const recordReducer = (state = init, action) => {
    const stateToUpdate = { ...state };
    switch (action.type) {
        case "SEARCH":
            stateToUpdate.searches[JSON.stringify(action.key)] = action.result;
        case "SET_RESULT":
            return { ...stateToUpdate, result: action.result };

    }
    return state;
};

export default recordReducer;

const isCached = (state, key) => state.search.searches[JSON.stringify(key)] !== undefined;
const getCached = (state, key) => state.search.searches[JSON.stringify(key)];

const search = (query, page, sort, advanced) => (dispatch, getState) => {
    const key = { query, page, sort };
    if (isCached(getState(), key)) return dispatch({
        type: "SET_RESULT",
        result: getCached(getState(), key)
    });
    searchService
        .search(query, page, sort, advanced)
        .then(result => {
            dispatch({
                type: "SEARCH",
                key,
                result
            });
            notify("success", "searched");
        })
        .catch(err => {
            console.log(err);
            notify("error", err.response.data.error);
        });
};

export const advancedSearch = (query, page, sort) => search(query, page, sort, true);
export const simpleSearch = (query, page, sort) => search(query, page, sort, false);