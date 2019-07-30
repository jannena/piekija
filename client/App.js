import React from "react";
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import Search from "./components/Search";
import Record from "./components/Record";

// TODO: Learn how React router works or make better (clearer) router

const App = () => {
    return (
        <Router>
            <Route exact path="/" render={() => <>
                Etusivu
                <Link to="/search">Hae</Link>
            </>} />
            <Route exact path="/search" render={({ location, history }) =>
                <Search queryParams={location.search} history={history} />
            } />
            <Route exact path="/record/:id" render={({ match, history }) => {
                console.log(match, match.params, match.params.id);
                return <Record id={match.params.id} history={history} />
            }} />
        </Router>
    );
};

export default App;