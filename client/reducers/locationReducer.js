import locationService from "../services/locationService";
import { onError } from "./errorHandingHelper";


const locationReducer = (state = [], action) => {
    switch (action.type) {
        case "SUCCESS_LOCATION_GET":
            return action.locations;
        case "PSUCCESS_LOCATION_CREATE":
            return state.concat(action.location);
        case "PSUCCESS_LOCATION_UPDATE":
            return state.map(loc => loc.id !== action.location.id ? loc : action.location);
        case "PSUCCESS_LOCATION_REMOVE":
            return state.filter(loc => loc.id !== action.locationId);
    }
    return state;
};

export default locationReducer;

export const createLocation = name => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_LOCATION_CREATE" });
    locationService
        .create(name, getState().token.token)
        .then(location => {
            dispatch({
                type: "PSUCCESS_LOCATION_CREATE",
                location
            });
        })
        .catch(onError(dispatch, "PFAILURE_LOCATION_CREATE"));
};

export const updateLocation = (locationId, newName) => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_LOCATION_UPDATE" });
    locationService
        .update(locationId, newName, getState().token.token)
        .then(location => {
            console.log(location);
            dispatch({
                type: "PSUCCESS_LOCATION_UPDATE",
                location
            });
        })
        .catch(onError(dispatch, "PFAILURE_LOCATION_UPDATE"));
};

export const removeLocation = locationId => (dispatch, getState) => {
    dispatch({ type: "PREQUEST_LOCATION_REMOVE" });
    locationService
        .remove(locationId, getState().token.token)
        .then(() => {
            dispatch({
                type: "PSUCCESS_LOCATION_REMOVE",
                locationId
            })
        })
        .catch(onError(dispatch, "PFAILURE_LOCATION_REMOVE"));
};

export const getLocations = () => (dispatch, getState) => {
    dispatch({ type: "REQUEST_LOCATION_GET" });
    locationService
        .getAll(getState().token.token)
        .then(locations => {
            dispatch({
                type: "SUCCESS_LOCATION_GET",
                locations
            });
        })
        .catch(onError(dispatch, "FAILURE_LOCATION_GET"));
};