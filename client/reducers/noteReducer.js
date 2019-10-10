import noteService from "../services/noteService";
import { onError } from "./errorHandingHelper";

const noteReducer = (state = [], action) => {
    switch (action.type) {
        case "SUCCESS_NOTES_GET":
            return action.notes;
        case "SUCCESS_NOTES_CREATE":
            return state.concat(action.note);
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

export const createNote = (title, content) => (dispatch, getState) => {
    dispatch({ type: "REQUEST_NOTES_CREATE" });
    noteService
        .create(title, content, getState().token.token)
        .then(notes => {
            dispatch({
                type: "SUCCESS_NOTES_CREATE",
                note
            });
        })
        .catch(onError(dispatch, "FAILURE_NOTES_CREATE"));
};