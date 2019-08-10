import React from "react";
import "../css/container.css";
import { Link } from "react-router-dom";

const Container = ({ children }) => {
    return (
        <div id="container">
            <header></header>
            <nav>
                <ul>
                    <li><Link to="/">Frontpage</Link></li>
                    <li><Link to="/search">Search</Link></li>
                    <li><Link to="/user">You</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><a href="javascript:(() => { window.localStorage.clear(); location.reload(); })();">Logout</a></li>
                </ul>
            </nav>
            <main>
                {children}
            </main>
            <footer>This is the footer.</footer>
        </div>
    );
};

export default Container;