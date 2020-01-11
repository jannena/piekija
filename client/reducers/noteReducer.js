import noteService from "../services/noteService";
import { onError } from "./errorHandingHelper";

const noteReducer = (state = [], action) => {
    switch (action.type) {
        case "SUCCESS_NOTES_GET":
            return action.notes;
        case "SUCCESS_NOTES_CREATE":
            return state.concat(action.note);
        case "SUCCESS_NOTES_REMOVE":
            return state.filter(n => n.id !== action.id);
        case "SUCCESS_NOTES_UPDATE":
            return state.map(n => n.id === action.note.id ? action.note : n)
    }
    return state;
};

export default noteReducer;

export const getLastNotes = () => dispatch => {
    dispatch({ type: "REQUEST_NOTES_GET" });
    noteService
        .getLast()
        .then(notes => {
            dispatch({
                type: "SUCCESS_NOTES_GET",
                notes
            });
        })
        .catch(onError(dispatch, "FAILURE_NOTES_GET"));
};

export const getAllNotes = () => (dispatch, getState) => {
    dispatch({ type: "REQUEST_NOTES_GET_ALL" });
    noteService
        .getAll(getState().token.token)
        .then(notes => {
            dispatch({
                type: "SUCCESS_NOTES_GET_ALL",
                notes
            });
        })
        .catch(onError(dispatch, "FAILURE_NOTES_GET_ALL"));
};

export const createNote = (title, content) => (dispatch, getState) => {
    dispatch({ type: "REQUEST_NOTES_CREATE" });
    noteService
        .create(title, content, getState().token.token)
        .then(note => {
            dispatch({
                type: "SUCCESS_NOTES_CREATE",
                note
            });
        })
        .catch(onError(dispatch, "FAILURE_NOTES_CREATE"));
};

export const removeNote = id => (dispatch, getState) => {
    dispatch({ type: "REQUEST_NOTES_REMOVE" });
    noteService
        .remove(id, getState().token.token)
        .then(() => {
            dispatch({
                type: "SUCCESS_NOTES_REMOVE",
                id
            });
        })
        .catch(onError(dispatch, "FAILURE_NOTES_REMOVE"));
};

export const updateNote = (id, title, content) => (dispatch, getState) => {
    dispatch({ type: "REQUEST_NOTES_UPDATE" });
    noteService
        .update(id, title, content, getState().token.token)
        .then(note => {
            dispatch({
                type: "SUCCESS_NOTES_UPDATE",
                note
            });
        })
        .catch(onError(dispatch, "FAILURE_NOTES_UPDATE"));
};