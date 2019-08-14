
const notificationReducer = (state = [], action) => {
    switch (action.type) {
        case "NOTIFY":
            return [
                ...state,
                {
                    type: action.importance || "success",
                    message: action.message || "Error: error message not given"
                }
            ]
        case "REMOVE_FIRST_NOTIFICATION":
            return state.slice(1);
    }
    return state;
};

export default notificationReducer;


export const notify = (type, message) => dispatch => {
    dispatch({
        type: "NOTIFY",
        importance: type,
        message
    });
    setTimeout(() => {
        dispatch({
            type: "REMOVE_FIRST_NOTIFICATION"
        })
    }, 10000);
};