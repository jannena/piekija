import recordService from "../services/recordService";
import itemService from "../services/itemService";
import { notify } from "./notificationReducer";
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
            console.log("joojoo");
            return {
                ...state,
                record: action.record
            };
        case "PSUCCESS_RECORD_ADD_ITEM":
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
        case "PSUCCESS_RECORD_UPDATE_ITEM":
            if (!state.record) return state;
            return {
                ...state,
                record: {
                    ...state.record,
                    result: {
                        ...state.record.result,
                        items: state.record.result.items.map(item => item.id !== action.item.id ? item : action.item)
                    }
                }
            };
        case "PSUCCESS_RECORD_REMOVE_ITEM":
            if (!state.record) return state;
            return {
                ...state,
                record: {
                    ...state.record,
                    result: {
                        ...state.record.result,
                        items: state.record.result.items.filter(item => item.id !== action.itemId)
                    }
                }
            }
        case "SUCCESS_RECORD_REMOVE":
            // TODO: How about search result cache????
            return {
                cache: state.cache.filter(record => record.result.id !== action.record),
                record: {}
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
    dispatch({ type: "PREQUEST_RECORD_UPDATE" });
    recordService
        .updateMARC(recordId, recordMARC, getState().token.token)
        .then(record => {
            console.log(record);
            dispatch({
                type: "PSUCCESS_RECORD_GET",
                record: {
                    result: record,
                    record: MARC21.tryParse(record.record)
                }
            })
        })
        .catch(onError(dispatch, "PFAILURE_RECORD_UPDATE"));
};

export const removeRecord = history => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_RECORD_REMOVE" });
    recordService
        .remove(getState().record.record.result.id, getState().token.token)
        .then(() => {
            dispatch({
                type: "PSUCCESS_RECORD_REMOVE",
                record: getState().record.record.id
            });
            dispatch(notify("success", "Successfully removed record!"));
            history.push("/staff/records");
        })
        .catch(onError(dispatch, "PFAILURE_RECORD_REMOVE"));
};

export const createRecord = (recordMARC, history) => (dispatch, getState) => {
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
            dispatch(notify("success", "Successfully saved to database!"));
            history.push(`/staff/record/${record.id}`);
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

export const createTemporaryRecord = (record, result = { id: "preview", items: [], record }) => dispatch => {
    console.log("joojoo1");
    dispatch({
        type: "SET_RECORD",
        record: {
            result: { ...result, record },
            record: MARC21.tryParse(record)
        }
    });
};

export const addItem = (loantype, location, state, note, barcode) => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_RECORD_ADD_ITEM" });
    itemService
        .addItem(barcode, getState().record.record.result.id, loantype, location, state, note, getState().token.token)
        .then(result => {
            dispatch({
                type: "PSUCCESS_RECORD_ADD_ITEM",
                item: result
            });
        })
        .catch(onError(dispatch, "PFAILURE_RECORD_ADD_ITEM"));
};

export const updateItem = (itemId, loantype, location, state, note) => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_RECORD_UPDATE_ITEM" });
    itemService
        .updateItem(itemId, loantype, location, state, note, getState().token.token)
        .then(result => {
            dispatch({
                type: "PSUCCESS_RECORD_UPDATE_ITEM",
                item: result
            });
        })
        .catch(onError(dispatch, "PFAILURE_RECORD_UPDATE_ITEM"));
};

export const removeItem = itemId => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_RECORD_REMOVE_ITEM" });
    itemService
        .removeItem(itemId, getState().token.token)
        .then(result => {
            dispatch({
                type: "PSUCCESS_RECORD_REMOVE_ITEM",
                itemId
            });
        })
        .catch(onError(dispatch, "PSUCCESS_RECORD_REMOVE_ITEM"));
};