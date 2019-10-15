import { search } from "./searchReducer";

const init = {
    type: "",
    query: "",
    sort: "relevance",
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
            return { ...state, sort: action.sort };
    }
    return state;
};

export default queryReducer;

export const setQuery = (advancement, query, sort = "relevance", page = 1) => dispatch => {
    dispatch({
        type: "SET_QUERY",
        advancement,
        query,
        sort,
        page
    });
    dispatch(search(query, page, sort, advancement === "advanced"));
};

export const resort = sort => (dispatch, getState) => {
    dispatch({
        type: "RESORT",
        sort
    });
    dispatch(search(getState().query.query, 1, sort, getState().query.advancement === "advanced"));
};

export const nextPage = () => (dispatch, getState) => {
    dispatch({
        type: "NEXT_PAGE"
    });
    dispatch(search(
        getState().query.query,
        getState().query.page,
        getState().query.sort,
        getState().query.type === "advanced"
    ));
};

export const previousPage = () => (dispatch, getState) => {
    dispatch({
        type: "PREVIOUS_PAGE"
    });
    dispatch(search(
        getState().query.query,
        getState().query.page,
        getState().query.sort,
        getState().query.type === "advanced"
    ));
};