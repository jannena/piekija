import recordService from "../services/recordService";
import itemService from "../services/itemService";
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
            };
        case "SUCCESS_RECORD_ADD_ITEM":
            return {
                ...state,
                record: {
                    ...state.record,
                    result: {
                        ...state.record.result,
                        items: (state.record ? state.record.result.items : []).concat(action.item)
                    }
                }
            };
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

export const createTemporaryRecord = record => dispatch => {
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

export const addItem = (loantype, location, state, note, barcode) => (dispatch, getState) => {
    dispatch({ type: "REQUEST_RECORD_ADD_ITEM" });
    itemService
        .addItem(getState().record.record.result.id, loantype, location, state, note, getState().token.token)
        .then(result => {
            dispatch({
                type: "SUCCESS_RECORD_ADD_ITEM",
                item: result
            });
        })
        .catch(onError(dispatch, "FAILURE_RECORD_ADD_ITEM"));
};