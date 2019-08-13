import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import Search from "./components/Search";
import Record from "./components/Record";
import Login from "./components/Login";
import UserInfo from "./components/UserInfo";
import userService from "./services/userService";
import Shelf from "./components/Shelf";
import Container from "./components/Container"
import { connect } from "react-redux";
import { getUser } from "./reducers/userReducer";
import { setToken } from "./reducers/tokenReducer";

// TODO: Learn how React router works or make better (clearer) router

const App = ({ token, getUser, setToken }) => {

    useEffect(() => {
        if (!token) return;
        getUser(); // TODO: What if token is invalid?
    }, [token]);

    useEffect(() => {
        const savedToken = window.localStorage.getItem("piekija-token");
        if (savedToken) setToken(savedToken);
    }, []);

    return (
        <Router>
            <Container>
                <Route exact path="/" render={() => <>
                    Etusivu
                    <Link to="/search">Hae</Link>
                    <Link to="/login">Kirjaudu sisään</Link>
                </>} />
                <Route exact path="/search" render={({ location, history }) =>
                    <Search queryParams={location.search} history={history} />
                } />
                <Route exact path="/record/:id" render={({ match, history }) => {
                    console.log(match, match.params, match.params.id);
                    return <Record id={match.params.id} history={history} />
                }} />
                <Route exact path="/login" render={() => <Login setToken={setToken} />} />
                <Route exact path="/user" render={() => {
                    return <UserInfo  />;
                }} />
                <Route exact path="/shelf/:id" render={({ match }) => {
                    return <Shelf shelfId={match.params.id} />;
                }} />
            </Container>
        </Router>
    );
};

export default connect(
    state => ({
        token: state.token
    }),
    { setToken, getUser }
)(App);