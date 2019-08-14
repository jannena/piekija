import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import tokenReducer from "./reducers/tokenReducer";
import userReducer from "./reducers/userReducer";
import notificationReducer from "./reducers/notificationReducer";

const reducer = combineReducers({
    token: tokenReducer,
    user: userReducer,
    notifications: notificationReducer
});

const store = createStore(reducer, applyMiddleware(thunk));

window.debug = store;

export default store;