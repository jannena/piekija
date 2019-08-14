import userService from "../services/userService";
import { notify } from "./notificationReducer";

const userReducer = (state = null, action) => {
    switch (action.type) {
        case "SET_USER":
            return action.user;
        case "SET_TFA":
            return !state ? state : {
                ...state,
                tfa: action.tfa,
                tfaqr: action.tfaqr
            }
    }
    return state;
};

export default userReducer;

export const getUser = () => async (dispatch, getState) => {
    try {
        const user = await userService.me(getState().token.token);
        console.log(user);
        dispatch({
            type: "SET_USER",
            user
        });
        dispatch(notify("success", "User infomation received succesfully!"));
    }
    catch (err) {
        console.log(err);
        if (!getState().token.token) dispatch(notify("error", err.response.data.error))
    }
};

export const updateUser = (oldPassword, name, password) => async (dispatch, getState) => {
    try {
        const newMe = await userService.updateMe({
            oldPassword,
            name,
            password
        }, getState().token.token);
        dispatch({
            type: "SET_USER",
            user: newMe
        });
        dispatch(notify("success", "User infomation updated!"));
    }
    catch (err) {
        console.log(err);
        dispatch(notify("error", err.response.data.error));
    }
};

export const setTFA = (oldPassword, tfa) => async (dispatch, getState) => {
    try {
        const { TFAQR } = await userService.updateMe({
            oldPassword,
            tfa
        }, getState().token.token);
        dispatch({
            type: "SET_TFA",
            tfa: !!TFAQR,
            tfaqr: TFAQR || null
        });
        dispatch(notify("success", `Two-factor authentication ${!!TFAQR ? "enabled" : "disabled"}!`));
    }
    catch (err) {
        console.log(err);
        dispatch(notify("error", err.response.data.error));
    }
};