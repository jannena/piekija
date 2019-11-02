import React from "react";
import ReactDOM from "react-dom";
import Navigation from "./Navigation";
import Container from "./Container";
import { BrowserRouter as Router } from "react-router-dom";
import "./docs.css";
import "../client/css/global.css";

const App = () => {
    return <>
        <Router>
            <div id="top">
                <span><a href="/">&lt;&lt; Takaisin etusivulle</a></span>
                <span> | PieKijan ohjeet</span>
            </div>
            <div id="bottom">
                <Navigation />
                <Container />
            </div>
        </Router>
    </>
};

ReactDOM.render(<App />, document.getElementById("root"));