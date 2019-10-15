import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import Search from "./components/Search";
import Record from "./components/record/Record";
import Login from "./components/Login";
import UserInfo from "./components/UserInfo";
import Shelf from "./components/Shelf";
import Container from "./components/Container"
import { connect } from "react-redux";
import { getUser } from "./reducers/userReducer";
import { setToken } from "./reducers/tokenReducer";
import "./css/global.css";
import AdvancedSearch from "./components/AdvancedSearch";
import Staff from "./components/staff/Staff";
import StaffEditRecord from "./components/staff/StaffEditRecord";
import { getLastNotes } from "./reducers/noteReducer";

import { addRecord, removeRecord, updateRecord, localShare, localUnhare, localUpdateShelf } from "./reducers/shelfReducer";
import { setSocketIOEventListeners, startWS } from "./socket";

// TODO: Learn how React router works or make better (clearer) router

const App = ({ token, user, getUser, setToken, addRecord, removeRecord, updateRecord, localShare, localUnhare, localUpdateShelf, getLastNotes, news }) => {
    useEffect(() => {
        if (token && user) {
            startWS();

            const runIfNotMe = (data, func) => {
                try { console.log("runIfNotMe", data, user, data.inCharge.id, "===", user.id, "-->", data.inCharge.id === user.id); } catch (e) { }
                if (!data.inCharge) return () => { };
                if (!data.inCharge.id) return () => { };
                if (data.inCharge.id !== user.id) return func(data);
                else return () => { };
            };
            setSocketIOEventListeners(
                data => runIfNotMe(data, addRecord),
                data => runIfNotMe(data, removeRecord),
                data => runIfNotMe(data, updateRecord),
                shelf => console.log("changed to shelf", shelf),
                user => runIfNotMe(user, localShare),
                user => runIfNotMe(user, localUnhare),
                data => runIfNotMe(data, localUpdateShelf)
            );
        }
    }, [token, user]);

    useEffect(() => {
        if (!token) return;
        getUser(); // TODO: What if token is invalid?
    }, [token]);

    useEffect(() => {
        const savedToken = window.localStorage.getItem("piekija-token");
        if (savedToken) setToken(savedToken);
    }, []);

    useEffect(() => {
        getLastNotes();
    }, []);

    return (
        <Router>
            <Container>
                {/* Screens open for everyone */}
                <Route exact path="/" render={() => <>
                    <h2>News</h2>
                    {news.map(n => <div>
                        <h3>{n.title}</h3>
                        <div>{n.content}</div>
                    </div>)}
                </>} />
                <Route exact path="/search" render={({ location, history }) =>
                    <>
                        <AdvancedSearch />
                        <hr />
                        <Search />
                    </>
                } />
                <Route exact path="/record/:id" render={({ match, history }) => {
                    console.log(match, match.params, match.params.id);
                    return <Record id={match.params.id} history={history} />
                }} />


                {/* Screens for logged in users */}
                <Route exact path="/login" render={() => <Login setToken={setToken} />} />
                <Route exact path="/user" render={() => {
                    return <UserInfo />;
                }} />
                <Route exact path="/shelf/:id" render={({ match }) => {
                    return <Shelf shelfId={match.params.id} />;
                }} />


                {/* Staff screens */}
                <Route path="/staff" render={({ history }) => <Staff history={history} />} />
                <Route path="/staff/record/:id" render={({ match }) => <StaffEditRecord id={match.params.id} />} />
            </Container>
        </Router>
    );
};

export default connect(
    state => ({
        token: state.token.token,
        user: state.user,
        news: state.notes
    }),
    { setToken, getUser, addRecord, removeRecord, updateRecord, localShare, localUnhare, localUpdateShelf, getLastNotes }
)(App);