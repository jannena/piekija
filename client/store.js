import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import tokenReducer from "./reducers/tokenReducer";
import userReducer from "./reducers/userReducer";

const reducer = combineReducers({
    token: tokenReducer,
    user: userReducer
});

const store = createStore(reducer, applyMiddleware(thunk));

window.debug = store;

export default store;