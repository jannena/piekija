import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import tokenReducer from "./reducers/tokenReducer";
import userReducer from "./reducers/userReducer";
import notificationReducer from "./reducers/notificationReducer";
import searchReducer from "./reducers/searchReducer";
import queryReducer from "./reducers/queryReducer";
import shelfReducer from "./reducers/shelfReducer";
import recordReducer from "./reducers/recordReducer";
import locationReducer from "./reducers/locationReducer";
import loantypeReducer from "./reducers/loantypeReducer";
import loadingReducer from "./reducers/loadingReducer";
import circulationReducer from "./reducers/circulationReducer";
import noteReducer from "./reducers/noteReducer";
import languageReducer from "./reducers/languageReducer";
import statisticsReducer from "./reducers/statisticsReducer";
import currentLocationReducer from "./reducers/currentLocationReducer";
import { composeWithDevTools } from "redux-devtools-extension";

const reducer = combineReducers({
    token: tokenReducer,
    user: userReducer,
    notifications: notificationReducer,
    search: searchReducer,
    query: queryReducer,
    shelf: shelfReducer,
    record: recordReducer,
    location: locationReducer,
    loantype: loantypeReducer,
    loading: loadingReducer,
    circulation: circulationReducer,
    notes: noteReducer,
    language: languageReducer,
    statistics: statisticsReducer,
    currentLocation: currentLocationReducer
});

const store = createStore(reducer, composeWithDevTools(
    applyMiddleware(thunk)
));

window.debug = store;

export default store;