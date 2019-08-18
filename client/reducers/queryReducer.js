import { search } from "./searchReducer";

const init = {
    type: "",
    query: "",
    sort: null,
    page: 1
};

const queryReducer = (state = init, action) => {
    switch (action.type) {
        case "NEXT_PAGE":
            return { ...state, page: state.page + 1 };
        case "PREVIOUS_PAGE":
            if (state.page === 1) return state;
            return { ...state, page: state.page - 1 };
        case "SET_QUERY":
            return {
                type: action.advancement,
                query: action.query,
                sort: null,
                page: 1
            };
        case "RESORT":
            break;
    }
    return state;
};

export default queryReducer;

export const setQuery = (advancement, query) => dispatch => {
    dispatch({
        type: "SET_QUERY",
        advancement,
        query
    });
    dispatch(search(query, 1, undefined, advancement === "advanced"));
};

export const nextPage = () => (dispatch, getState) => {
    dispatch({
        type: "NEXT_PAGE"
    });
    dispatch(search(
        getState().query.query,
        getState().query.page + 1,
        undefined,
        getState().query.type === "advanced"
    ));
};

export const previousPage = () => (dispatch, getState) => {
    dispatch({
        type: "PREVIOUS_PAGE"
    });
    dispatch(search(
        getState().query.query,
        getState().query.page - 1,
        undefined,
        getState().query.type === "advanced"
    ));
};