import shelfService from "../services/shelfService";
import { notify } from "./notificationReducer";

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
        case "UNSHARE":
        case "ADD_RECORD":
            return {
                ...state,
                shelf: {
                    ...state.shelf,
                    records: state.shelf.records.concat(action.record)
                }
            };
        case "UPDATE_RECORD":
            console.log(stateToUpdate.shelf.records[3].record.id, action.recordId);
            stateToUpdate.shelf.records = stateToUpdate.shelf.records.map(record => record.record.id === action.recordId ? { ...record, note: action.note }: record);
            console.log(stateToUpdate);
            return stateToUpdate;
            /* return {
                ...state,
                shelf: {
                    ...state.shelf,
                    records: state.shelf.records.map(record => record.id === action.recordId ? { ...record, note: action.note } : record)
                }
            }; */
        case "REMOVE_RECORD":
            return {
                ...state,
                shelf: {
                    ...state.shelf,
                    records: state.shelf.records.filter(record => record.id !== action.recordId)
                }
            };
    }
    return state;
};

export default shelfReducer;

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

export const addRecordToShelf = record => (dispatch, getState) => {
    shelfService
        .addRecord(getState().shelf.shelf.id, record, getState().token.token)
        .then(addedRecord => {
            dispatch({
                type: "ADD_RECORD",
                record: addedRecord
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