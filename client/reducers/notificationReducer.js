
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
                    message: action.message || "Error: error message not given"
                }
            ]
        case "REMOVE_FIRST_NOTIFICATION":
            return state.slice(1);
    }
    return state;
};

export default notificationReducer;


export const notify = (type, message, extension) => (dispatch, getState) => {
    dispatch({
        type: "NOTIFY",
        importance: type,
        message: [message, extension]
    });
    setTimeout(() => {
        dispatch({
            type: "REMOVE_FIRST_NOTIFICATION"
        })
    }, 10000);
};