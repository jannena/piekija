import locationService from "../services/locationService";
import { onError } from "./errorHandingHelper";


const locationReducer = (state = [], action) => {
    switch (action.type) {
        case "SUCCESS_LOCATION_GET":
            return action.locations;
        case "SUCCESS_LOCATION_CREATE":
            return state.concat(action.location);
        case "SUCCESS_LOCATION_UPDATE":
        case "SUCCESS_LOCATION_REMOVE":
    }
    return state;
};

export default locationReducer;

export const createLocation = name => (dispatch, getState) => {
    dispatch({ type: "REQUEST_LOCATION_CREATE" });
    locationService
        .create(name, getState().token.token)
        .then(location => {
            dispatch({
                type: "SUCCESS_LOCATION_CREATE",
                location
            });
        })
        .catch(onError(dispatch, "FAILURE_LOCATION_CREATE"));
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