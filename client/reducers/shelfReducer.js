import shelfService from "../services/shelfService";
import { notify } from "./notificationReducer";
import { DH_NOT_SUITABLE_GENERATOR } from "constants";

const init = {
    cache: {},
    shelf: null
};

// TODO: Do this need caching?

const shelfReducer = (state = init, action) => {
    const stateToUpdate = { ...state };
    switch (action.type) {
        case "FETCH_SHELF":
        // stateToUpdate.cache[action.shelf.id] = action.shelf;
        case "SET_SHELF":
            return {
                ...stateToUpdate,
                shelf: action.shelf
            };
        case "UPDATE_SHELF":
        case "SHARE":
            return {
                ...state,
                shelf: {
                    ...state.shelf,
                    sharedWith: state.shelf.sharedWith.concat(action.sharedWith)
                }
            };
        case "UNSHARE":
            return {
                ...state,
                shelf: {
                    ...state.shelf,
                    sharedWith: state.shelf.sharedWith.filter(user => user.username !== action.username)
                }
            };
        case "ADD_RECORD":
            if (state.shelf.id !== action.shelfId) return state;
            return {
                ...state,
                shelf: {
                    ...state.shelf,
                    records: state.shelf.records.concat(action.record)
                }
            };
        case "UPDATE_RECORD":
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
        case "REMOVE_RECORD":
            return {
                ...state,
                shelf: {
                    ...state.shelf,
                    records: state.shelf.records.filter(record => record.record.id !== action.recordId)
                }
            };
    }
    return state;
};

export default shelfReducer;

// TODO: Add error handling

export const getShelf = id => (dispatch, getState) => {
    /* const cachedShelf = getState().shelf.cache[id];
    if (cachedShelf) return dispatch({
        type: "SET_SHELF",
        shelf: cachedShelf
    }); */
    shelfService
        .get(id, getState().token.token)
        .then(shelf => {
            dispatch({
                type: "FETCH_SHELF",
                shelf
            });
        })
        .catch(err => {
            console.log(err);
        });
};

export const createShelf = (name, publicity) => (dispatch, getState) => {
    shelfService
        .create(name, "", publicity, getState().token.token)
        .then(response => {
            dispatch({
                type: "CREATE_SHELF",
                shelf: response
            });
        })
        .catch(err => { });
};

export const addRecordToShelf = (recordId, shelfId) => (dispatch, getState) => {
    const shelf = shelfId === undefined ? getState().shelf.shelf.id : shelfId;
    shelfService
        .addRecord(shelf, recordId, getState().token.token)
        .then(addedRecord => {
            dispatch({
                type: "ADD_RECORD",
                record: addedRecord,
                shelfId: shelf
            });
        })
        .catch(err => { });
};

export const updateRecordInShelf = (record, note) => (dispatch, getState) => {
    shelfService
        .editRecord(getState().shelf.shelf.id, record, note, getState().token.token)
        .then(response => {
            dispatch({
                type: "UPDATE_RECORD",
                recordId: record,
                note
            });
            dispatch(notify("success", "record changed"));
            console.log("Changed state!!");
        })
        .catch(err => {
            console.log(err);
        });
};

export const deleteRecordFromShelf = record => (dispatch, getState) => {
    shelfService
        .removeRecord(getState().shelf.shelf.id, record, getState().token.token)
        .then(response => {
            dispatch({
                type: "REMOVE_RECORD",
                recordId: record
            });
        })
        .catch(err => { });
};

export const shareShelf = username => (dispatch, getState) => {
    shelfService
        .share(getState().shelf.shelf.id, username, getState().token.token)
        .then(response => {
            dispatch({
                type: "SHARE",
                sharedWith: response
            });
            dispatch(notify("success", `shared with ${response.username} (${response.name})`));
        })
        .catch(err => { });
};

export const unshareShelf = username => (dispatch, getState) => {
    shelfService
        .unshare(getState().shelf.shelf.id, username, getState().token.token)
        .then(response => {
            dispatch({
                type: "UNSHARE",
                username
            });
            dispatch(notify("success", `unshared with ${username}`));
        })
        .catch(err => { });
};