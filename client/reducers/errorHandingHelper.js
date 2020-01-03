import { notify } from "./notificationReducer";

export const onError = (dispatch, type) => err => {
    try {
        console.log(err, err.response);
        const error = err.response.status === 404 ? "Not found" : err.response.data.error;
        dispatch({
            type,
            error
        });
        dispatch(notify("error", err.response.data.error));
        setTimeout(() => dispatch({
            type: "REMOVE_FIRST_NOTIFICATION"
        }), 8000);
    }
    catch (error) {
        console.log("Error in error handler (invalid syntax?)", error, error.message);
    }
};