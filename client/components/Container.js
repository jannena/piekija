import React from "react";
import "../css/container.css";
import { Link } from "react-router-dom";
import Notifications from "./Notifications";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { simpleSearch } from "../reducers/searchReducer";
import { setQuery } from "../reducers/queryReducer";
import UserMenu from "./UserMenu";

// TODO: Create user/login/staff menu

const Container = ({ loading, history, simpleSearch, setQuery, children }) => {
    const handleSearch = e => {
        e.preventDefault();
        const newQuery = e.target.query.value
        // simpleSearch(newQuery, 1, "relevance");
        setQuery("simple", newQuery, "relevance", 1);
        history.push("/search");
    };

    return (
        <div id="container">
            <header>
                <div id="header-content">
                    <div id="site-title">PieKiJa/logo/tms.</div>
                    <p>Currently loading {loading} things</p>
                    <div id="search">
                        <form onSubmit={handleSearch}>
                            <input name="query" style={{ width: "90%", margin: 0 }} />
                            <button style={{ width: "10%", margin: 0 }}>Search</button>
                        </form>
                    </div>
                    <nav>
                        <ul>
                            <li><Link to="/">Frontpage</Link></li>
                            <li><Link to="/search">Search</Link></li>
                            <li><a href="/docs">Help</a></li>
                        </ul>
                        <UserMenu />
                    </nav>
                </div>
            </header>
            <main>
                {children}
                <Notifications />
            </main>
            <footer>This is the footer.</footer>
        </div>
    );
};

export default connect(
    state => ({
        loading: state.loading.loading
    }),
    { simpleSearch, setQuery }
)(withRouter(Container));