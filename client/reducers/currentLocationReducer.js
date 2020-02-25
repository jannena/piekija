
const init = window.localStorage.getItem("piekija-current-location") || null;

const currentLocationReducer = (state = init, action) => {
    switch (action.type) {
        case "SET_CURRENT_LOCATION":
            window.localStorage.setItem("piekija-current-location", action.currentLocation);
            return action.currentLocation;
    }
    return state;
};

export const setCurrentLocation = location => dispatch => {
    dispatch({
        type: "SET_CURRENT_LOCATION",
        currentLocation: location
    });
};

export default currentLocationReducer;