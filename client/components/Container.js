import React from "react";
import "../css/container.css";
import { Link } from "react-router-dom";
import Notifications from "./Notifications";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { simpleSearch } from "../reducers/searchReducer";
import { setQuery } from "../reducers/queryReducer";
import UserMenu from "./UserMenu";
import Select from "./Select";
import { setLanguage } from "../reducers/languageReducer";
import __ from "../langs";


const Container = ({ loading, history, simpleSearch, setQuery, children, language, setLanguage, __ }) => {
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
                    <div id="site-title">{__("PieKiJa")}</div>
                    {/* <p>Currently loading {loading} things</p> */}
                    <div id="search">
                        <form onSubmit={handleSearch}>
                            <input id="main-search-field" placeholder={__("Search-button") + "..."} name="query" style={{ width: "calc(90% - 70px)", margin: 0, fontSize: 20, height: 45 }} />
                            <button id="search-button" style={{ width: 70, margin: 0, height: 45, position: "relative", top: -3 }}>{__("Search-button")}</button>
                        </form>
                    </div>
                    <nav>
                        <ul>
                            <li><Link to="/">{__("Frontpage")}</Link></li>
                            <li><Link id="menu-search-link" to="/search">{__("Search-menu")}</Link></li>
                            <li><a href="/docs">{__("Help")}</a></li>
                        </ul>
                        <UserMenu />
                    </nav>
                </div>
            </header>
            <main>
                {children}
                <Notifications />
            </main>
            <footer>
                <div>This is the footer.</div>
                <div>
                    <Select selected={language} options={[["Suomi", "fi"], ["English", "en"]]} onChange={e => setLanguage(e.target.value)} />
                </div>
            </footer>
        </div>
    );
};

export default connect(
    state => ({
        loading: state.loading.loading,
        language: state.language,
        __: __(state)
    }),
    { simpleSearch, setQuery, setLanguage }
)(withRouter(Container));