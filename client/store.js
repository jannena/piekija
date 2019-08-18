import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import tokenReducer from "./reducers/tokenReducer";
import userReducer from "./reducers/userReducer";
import notificationReducer from "./reducers/notificationReducer";
import searchReducer from "./reducers/searchReducer";
import queryReducer from "./reducers/queryReducer";
import shelfReducer from "./reducers/shelfReducer";
import { composeWithDevTools } from "redux-devtools-extension";

const reducer = combineReducers({
    token: tokenReducer,
    user: userReducer,
    notifications: notificationReducer,
    search: searchReducer,
    query: queryReducer,
    shelf: shelfReducer
});

const store = createStore(reducer, composeWithDevTools(
    applyMiddleware(thunk)
));

window.debug = store;

export default store;