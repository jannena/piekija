import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import Search from "./components/Search";
import Record from "./components/Record";
import Login from "./components/Login";
import UserInfo from "./components/UserInfo";
import userService from "./services/userService";
import Shelf from "./components/Shelf";

// TODO: Learn how React router works or make better (clearer) router

const App = () => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        console.log("token changed", token);
        if (!token) return;
        userService
            .me(token)
            .then(res => {
                console.log("user logged in", res);
                setUser(res);
            })
            .catch(err => {
                console.log(err);
            });
    }, [token]);

    useEffect(() => {
        setToken(window.localStorage.getItem("piekija-token"));
    }, []);

    return (
        <Router>
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
                return <UserInfo user={user} />;
            }} />
            <Route exact path="/shelf/:id" render={({ match }) => {
                return <Shelf shelfId={match.params.id} user={user} />;
            }} />
        </Router>
    );
};

export default App;