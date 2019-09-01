import React from "react";
import "../css/container.css";
import { Link } from "react-router-dom";
import Notifications from "./Notifications";
import { connect } from "react-redux";

const Container = ({ loading, children }) => {
    return (
        <div id="container">
            <header>
                <p>Currently loading {loading} things</p>
            </header>
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
    })
)(Container);