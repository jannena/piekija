import userService from "../services/userService";
import { notify } from "./notificationReducer";
import { onError } from "./errorHandingHelper";

// TODO: Update to user loader

const userReducer = (state = null, action) => {
    switch (action.type) {
        case "SAVE_USER":
            return { ...action.user, loans: state.loans };
        case "GET_LOANHISTORY":
            return {
                ...state,
                loanHistory: action.loanhistory
            };
        case "SET_LOANHISTORY":
            return {
                ...state,
                loanHistoryRetention: action.loanhistory
            };
        case "SET_USER":
            return action.user;
        case "SET_TFA":
            return !state ? state : {
                ...state,
                tfa: action.tfa,
                tfaqr: action.tfaqr
            }
        case "LOCAL_REMOVE":
            return {
                ...state,
                shelves: state.shelves.filter(shelf => action.id !== shelf.id.id)
            };
        case "SUCCESS_SHELF_CREATE":
            return {
                ...state,
                shelves: state.shelves.concat({ note: "", id: { id: action.shelf.id, name: action.shelf.name }, author: true })
            };
        case "PSUCCESS_SHELF_REMOVE":
            return {
                ...state,
                shelves: state.shelves.filter(shelf => action.id !== shelf.id.id)
            };
        case "PSUCCESS_CIRCULATION_RENEW":
            // TODO: Check whether loaner is same as logged in user
            return {
                ...state,
                loans: state.loans.map(l => action.item !== l.id ? l : ({
                    ...l,
                    stateDueDate: action.dueDate,
                    stateTimesRenewed: l.stateTimesRenewed + 1
                }))
            };
        case "PSUCCESS_CIRCULATION_PLACE_HOLD":
            return {
                ...state,
                holds: state.holds.concat(action.newHold)
            };
        case "PSUCCESS_CIRCULATION_REMOVE_HOLD":
            return {
                ...state,
                holds: state.holds.filter(h => h.record.id !== action.record)
            };
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
        if (!getState().token.token) dispatch(notify("error", err.response.data.error))
    }
};

export const getLoanHistory = () => (dispatch, getState) => {
    userService.getLoanHistory(getState().token.token)
        .then(loanhistory => {
            dispatch({
                type: "GET_LOANHISTORY",
                loanhistory
            });
        })
        .catch(onError(dispatch, "PFAILURE_LOANHISTORY_GET"));
};

export const updateUser = (oldPassword, name, password) => async (dispatch, getState) => {
    try {
        const newMe = await userService.updateMe({
            oldPassword,
            name,
            password
        }, getState().token.token);
        dispatch({
            type: "SAVE_USER",
            user: newMe
        });
        dispatch(notify("success", "User infomation was updated"));
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
        dispatch(notify("success", `Two-factor authentication was ${!!TFAQR ? "enabled" : "disabled"}`));
    }
    catch (err) {
        console.log(err);
        dispatch(notify("error", err.response.data.error));
    }
};

export const setLH = (oldPassword, loanhistory) => (dispatch, getState) => {
    userService.updateMe({
        oldPassword,
        loanhistory
    }, getState().token.token)
        .then(() => {
            dispatch({
                type: "SET_LOANHISTORY",
                loanhistory
            });
        })
        .catch(onError(dispatch, "PFAILURE_LOANHISTORY_EDIT"))
};