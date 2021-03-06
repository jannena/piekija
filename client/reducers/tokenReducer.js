import loginService from "../services/loginService";
import { notify } from "./notificationReducer";

const INIT = {
    token: null,
    use2fa: false
};

const tokenReducer = (state = INIT, action) => {
    switch (action.type) {
        case "SET_TOKEN":
            return {
                ...state,
                token: action.token
            };
        case "CLEAR_TOKEN":
            return INIT;
        case "CODE_NEEDED":
            // TODO: Definitely was not the best way to do this.
            return {
                ...state,
                usetfa: true
            };
    }
    return state;
};

export default tokenReducer;

export const tryLogin = (username, password, code) => async dispatch => {
    try {
        dispatch({ type: "PREQUEST_LOGIN" });
        const { token } = await loginService.login(username, password, code);
        if (!token) throw new Error("did not return token!!!");
        dispatch({
            type: "SET_TOKEN",
            token
        });
        dispatch({ type: "PSUCCESS_LOGIN" });

        window.localStorage.setItem("piekija-token", token);
        document.cookie = `piekija-token=${token}`;

        dispatch(notify("success", "Logged in"));
    }
    catch (err) {
        console.log(err);
        if (err.response.data.error === "code needed") {
            dispatch({
                type: "CODE_NEEDED"
            });
        }
        else {
            dispatch(notify("error", err.response.data.error));
            dispatch({ type: "PFAILURE_LOGIN", error: err.response.data.error });
        }
    }
};

export const setToken = token => dispatch => {
    dispatch({
        type: "SET_TOKEN",
        token
    });
}