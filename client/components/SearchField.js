import React, { useState } from "react";
import { connect } from "react-redux";
import { setQuery } from "../reducers/queryReducer";

const SearchField = ({ setQuery, query }) => {
    const search = e => {
        e.preventDefault();
        const newQuery = e.target.search.value;
        setQuery("simple", newQuery);
    };

    return (<div>
        <form onSubmit={search}>
            <input placeholder="Search query" name="search" defaultValue={query} />
            <button>Search</button>
        </form>
    </div>);
}

export default connect(
    state => ({
        query: state.query.type === "simple" ? state.query.query : null
    }),
    { setQuery }
)(SearchField);