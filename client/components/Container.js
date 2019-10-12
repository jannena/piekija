import React from "react";
import "../css/container.css";
import { Link } from "react-router-dom";
import Notifications from "./Notifications";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { simpleSearch } from "../reducers/searchReducer";

// TODO: Create user/login/staff menu

const Container = ({ loading, history, simpleSearch, children }) => {
    const handleSearch = e => {
        e.preventDefault();
        simpleSearch(e.target.query.value);
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
                            <input name="query" style={{ width: "90%" }} />
                            <button style={{ width: "10%" }}>Search</button>
                        </form>
                    </div>
                    <nav>
                        <ul>
                            <li><Link to="/">Frontpage</Link></li>
                            <li><Link to="/search">Search</Link></li>
                            <li><Link to="/user">You</Link></li>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/staff">Staff</Link></li>
                            <li><a href="javascript:(() => { window.localStorage.clear(); location.reload(); })();">Logout</a></li>
                        </ul>
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
    { simpleSearch }
)(withRouter(Container));