
const notificationReducer = (state = [], action) => {
    console.log("Start of action name", action.type, action.type.split("_"));
    const type = action.type.split("_")[0] === "FAILURE" ? "FAILURE" : action.type;
    if (type === "FAILURE") console.log("Halloo!");
    switch (type) {
        case "FAILURE":
            return [
                ...state,
                {
                    type: "error",
                    message: action.error
                }
            ];
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