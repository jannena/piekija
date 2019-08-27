import recordService from "../services/recordService";
import { onError } from "./errorHandingHelper";

const MARC21 = require("../../server/utils/marc21parser");

const init = {
    cache: {},
    record: {}
};

const recordReducer = (state = init, action) => {
    switch (action.type) {
        case "SUCCESS_RECORD_GET":
            return {
                ...state,
                cache: { ...state.cache, [action.record.result.id]: action.record },
                record: action.record
            };
        case "SET_RECORD":
            return {
                ...state,
                record: action.record
            }
    }
    return state;
};

export default recordReducer;

export const getRecord = recordId => (dispatch, getState) => {
    const cachedRecord = getState().record.cache[recordId];
    if (cachedRecord) return dispatch({
        type: "SET_RECORD",
        record: cachedRecord
    });
    dispatch({ type: "REQUEST_RECORD_GET" });
    recordService
        .get(recordId)
        .then(record => {
            dispatch({
                type: "SUCCESS_RECORD_GET",
                record: {
                    result: record,
                    record: MARC21.tryParse(record.record)
                }
            });
        })
        .catch(onError(dispatch, "FAILURE_RECORD_GET"));
};

export const updateRecord = (recordId, recordMARC) => (dispatch, getState) => {
    dispatch({ type: "REQUEST_RECORD_UPDATE" });
    recordService
        .updateMARC(recordId, recordMARC, getState().token.token)
        .then(record => {
            console.log(record);
            dispatch({
                type: "SUCCESS_RECORD_GET",
                record: {
                    result: record,
                    record: MARC21.tryParse(record.record)
                }
            })
        })
        .catch(onError(dispatch, "FAILURE_RECORD_UPDATE"));
};

export const removeRecord = () => (dispatch, getState) => { };

export const createRecord = recordMARC => (dispatch, getState) => {
    dispatch({ type: "REQUEST_RECORD_CREATE" });
    recordService
        .createWithMARC(recordMARC, getState().token.token)
        .then(record => {
            console.log(record);
            dispatch({
                type: "SUCCESS_RECORD_GET",
                record: {
                    result: record,
                    record: MARC21.tryParse(record.record)
                }
            });
        })
        .catch(onError(dispatch, "FAILURE_RECORD_CREATE"));
};

export const copyRecord = () => (dispatch, getState) => {
    dispatch({ type: "REQUEST_RECORD_COPY" });
    recordService
        .createWithMARC(getState().record.record.result.record, getState().token.token)
        .then(record => {
            console.log(record);
            dispatch({
                type: "SUCCESS_RECORD_GET",
                record: {
                    result: record,
                    record: MARC21.tryParse(record.record)
                }
            });
        })
        .catch(onError(dispatch, "FAILURE_RECORD_COPY"));
};

export const setRecord = record => dispatch => {
    dispatch({
        type: "SET_RECORD",
        record: {
            result: {
                id: "preview",
                items: []
            },
            record: MARC21.tryParse(record)
        }
    })
};