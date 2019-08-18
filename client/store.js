import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import tokenReducer from "./reducers/tokenReducer";
import userReducer from "./reducers/userReducer";
import notificationReducer from "./reducers/notificationReducer";
import searchReducer from "./reducers/searchReducer";
import { composeWithDevTools } from "redux-devtools-extension";

const reducer = combineReducers({
    token: tokenReducer,
    user: userReducer,
    notifications: notificationReducer,
    search: searchReducer
});

const store = createStore(reducer, composeWithDevTools(
    applyMiddleware(thunk)
));

window.debug = store;

export default store;