import userService from "../services/userService";

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
    }
    catch (err) {
        console.log(err);
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
    }
    catch (err) {
        console.log(err);
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
    }
    catch (err) {
        console.log(err);
    }
};