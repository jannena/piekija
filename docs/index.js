import React from "react";
import ReactDOM from "react-dom";
import Navigation from "./Navigation";
import Container from "./Container";
import "./docs.css";

const App = () => {
    return <>
        <div id="top">
            <span>Takaisin etusivulle</span>
            <span> | PieKijan ohjeet</span>
            </div>
        <div id="bottom">
            <Navigation />
            <Container />
        </div>
    </>
};

ReactDOM.render(<App />, document.getElementById("root"));