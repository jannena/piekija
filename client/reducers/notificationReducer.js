
const notificationReducer = (state = [], action) => {
    switch (action.type) {
        case "NOTIFY":
            return [
                ...state,
                {
                    type: action.importance || "success",
                    message: action.message || ["Error message not given"],
                    timeout: action.timeout
                }
            ]
        case "REMOVE_FIRST_NOTIFICATION":
            return state.slice(1);
        case "REMOVE_N_NOTIFICATION":
            return state.filter(notification => notification.timeout !== action.timeout);
    }
    return state;
};

export default notificationReducer;


export const notify = (type, message, extension) => (dispatch, getState) => {
    let timeout = setTimeout(() => {
        dispatch({
            type: "REMOVE_FIRST_NOTIFICATION"
        })
    }, 10000);
    dispatch({
        type: "NOTIFY",
        importance: type,
        message: [message, extension],
        timeout
    });
};

export const unnotify = timeout => dispatch => {
    clearTimeout(timeout);
    dispatch({
        type: "REMOVE_N_NOTIFICATION",
        timeout
    });
};