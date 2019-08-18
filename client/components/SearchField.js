import React, { useState } from "react";
import { connect } from "react-redux";
import { simpleSearch } from "../reducers/searchReducer";

const SearchField = ({ simpleSearch }) => {
    const [query, setQuery] = useState("");

    const search = e => {
        e.preventDefault();
        simpleSearch(query);
    };

    return (<div>
        <form onSubmit={search}>
            <input placeholder="Search query" value={query} onChange={({ target: { value } }) => setQuery(value)} />
            <button>Search</button>
        </form>
    </div>);
}

export default connect(
    null,
    { simpleSearch }
)(SearchField);