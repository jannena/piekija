import React, { useState } from "react";
import { connect } from "react-redux";
import { setQuery } from "../reducers/queryReducer";
import __ from "../langs";

const SearchField = ({ setQuery, query, __ }) => {
    const search = e => {
        e.preventDefault();
        const newQuery = e.target.search.value;
        setQuery("simple", newQuery);
    };

    return (<div>
        <form onSubmit={search}>
            <input placeholder="Search query" name="search" defaultValue={query} />
            <button>{__("search-button")}</button>
        </form>
    </div>);
}

export default connect(
    state => ({
        query: state.query.type === "simple" ? state.query.query : null,
        __: __(state)
    }),
    { setQuery }
)(SearchField);