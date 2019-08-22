import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import store from "./store";
import { Provider } from "react-redux";

const renderApp = () => {
    console.log("Going to rerender!");
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById("root"));
}

store.subscribe(() => renderApp());
renderApp();