import shelfService from "../services/shelfService";
import { notify } from "./notificationReducer";
import { onError } from "./errorHandingHelper";
import { ECONNREFUSED } from "constants";

const init = {
    cache: {},
    shelf: null
};

// TODO: Do this need caching?

const shelfReducer = (state = init, action) => {
    const stateToUpdate = { ...state };
    switch (action.type) {
        case "SUCCESS_SHELF_FETCH":
        // stateToUpdate.cache[action.shelf.id] = action.shelf;
        case "SET_SHELF":
            return {
                ...stateToUpdate,
                shelf: action.shelf
            };
        case "PSUCCESS_SHELF_UPDATE":
            console.log("PSUCCESS_SHELF_UPDATE", action, {
                ...state,
                shelf: {
                    name: action.shelf.name,
                    description: action.shelf.description,
                    public: action.shelf.public,
                    ...state.shelf
                }
            });
            console.log(action.shelf.name, action.shelf.description, action.shelf.public);
            return {
                ...state,
                shelf: {
                    ...state.shelf,
                    name: action.shelf.name,
                    description: action.shelf.description,
                    public: action.shelf.public
                }
            };
        case "PSUCCESS_SHELF_SHARE":
            return {
                ...state,
                shelf: {
                    ...state.shelf,
                    sharedWith: state.shelf.sharedWith.concat(action.sharedWith)
                }
            };
        case "PSUCCESS_SHELF_UNSHARE":
            return {
                ...state,
                shelf: {
                    ...state.shelf,
                    sharedWith: state.shelf.sharedWith.filter(user => user.username !== action.username)
                }
            };
        case "PSUCCESS_SHELF_ADD_RECORD":
            if (state.shelf.id !== action.shelfId) return state;
            return {
                ...state,
                shelf: {
                    ...state.shelf,
                    records: state.shelf.records.concat(action.record)
                }
            };
        case "PSUCCESS_SHELF_UPDATE_RECORD":
            // console.log(stateToUpdate.shelf.records[3].record.id, action.recordId);
            // stateToUpdate.shelf.records = stateToUpdate.shelf.records.map(record => record.record.id === action.recordId ? { ...record, note: action.note } : record);
            // console.log("stateToUpdate", stateToUpdate, "is same?", JSON.stringify(state) === JSON.stringify(stateToUpdate));
            // return stateToUpdate;
            return {
                ...state,
                shelf: {
                    ...state.shelf,
                    records: state.shelf.records.map(record => record.record.id === action.recordId ? { ...record, note: action.note } : record)
                }
            };
        case "PSUCCESS_SHELF_REMOVE_RECORD":
            return {
                ...state,
                shelf: {
                    ...state.shelf,
                    records: state.shelf.records.filter(record => record._id !== action.recordId)
                }
            };
    }
    return state;
};

export default shelfReducer;

export const getShelf = id => (dispatch, getState) => {
    dispatch({ type: "REQUEST_SHELF_FETCH" });
    /* const cachedShelf = getState().shelf.cache[id];
    if (cachedShelf) return dispatch({
        type: "SET_SHELF",
        shelf: cachedShelf
    }); */
    shelfService
        .get(id, getState().token.token)
        .then(shelf => {
            dispatch({
                type: "SUCCESS_SHELF_FETCH",
                shelf
            });
        })
        .catch(onError(dispatch, "FAILURE_SHELF_FETCH"));
};

export const createShelf = (name, publicity) => (dispatch, getState) => {
    dispatch({ type: "REQUEST_SHELF_CREATE" });
    shelfService
        .create(name, "", publicity, getState().token.token)
        .then(response => {
            dispatch({
                type: "SUCCESS_SHELF_CREATE",
                shelf: response
            });
        })
        .catch(onError(dispatch, "FAILURE_SHELF_CREATE"));
};

export const updateShelf = (name, description, publicity) => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_SHELF_UPDATE" });
    shelfService
        .update(getState().shelf.shelf.id, name, description, publicity, getState().token.token)
        .then(response => {
            dispatch({
                type: "PSUCCESS_SHELF_UPDATE",
                shelf: response
            });
        })
        .catch(onError(dispatch, "PFAILURE_SHELF_UPDATE"));
};

export const addRecordToShelf = (recordId, shelfId) => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_SHELF_ADD_RECORD" });
    const shelf = shelfId === undefined ? getState().shelf.shelf.id : shelfId;
    shelfService
        .addRecord(shelf, recordId, getState().token.token)
        .then(addedRecord => {
            dispatch({
                type: "PSUCCESS_SHELF_ADD_RECORD",
                record: addedRecord,
                shelfId: shelf
            });
        })
        .catch(onError(dispatch, "PFAILURE_SHELF_ADD_RECORD"));
};

export const updateRecordInShelf = (record, note) => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_SHELF_UPDATE_RECORD" });
    shelfService
        .editRecord(getState().shelf.shelf.id, record, note, getState().token.token)
        .then(response => {
            dispatch({
                type: "PSUCCESS_SHELF_UPDATE_RECORD",
                recordId: record,
                note
            });
            dispatch(notify("success", "record changed"));
            console.log("Changed state!!");
        })
        .catch(onError(dispatch, "PFAILURE_SHELF_UPDATE_RECORD"));
};

export const deleteRecordFromShelf = record => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_SHELF_REMOVE_RECORD" });
    shelfService
        .removeRecord(getState().shelf.shelf.id, record, getState().token.token)
        .then(() => {
            dispatch({
                type: "PSUCCESS_SHELF_REMOVE_RECORD",
                recordId: record
            });
        })
        .catch(onError(dispatch, "PFAILURE_SHELF_REMOVE_ERROR"));
};

export const shareShelf = username => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_SHELF_SHARE" });
    shelfService
        .share(getState().shelf.shelf.id, username, getState().token.token)
        .then(response => {
            dispatch({
                type: "PSUCCESS_SHELF_SHARE",
                sharedWith: response
            });
            dispatch(notify("success", `shared with ${response.username} (${response.name})`));
        })
        .catch(onError(dispatch, "PFAILURE_SHELF_SHARE"));
};

export const unshareShelf = username => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_SHELF_UNSHARE" });
    shelfService
        .unshare(getState().shelf.shelf.id, username, getState().token.token)
        .then(() => {
            dispatch({
                type: "PSUCCESS_SHELF_UNSHARE",
                username
            });
            dispatch(notify("success", `unshared with ${username}`));
        })
        .catch(onError(dispatch, "PFAILURE_SHELF_UNSHARE"));
};