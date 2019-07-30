import React, { useState } from "react";

const SearchField = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const search = e => {
        e.preventDefault();
        onSearch(query);
    };

    return (<div>
        <form onSubmit={search}>
            <input placeholder="Search query" value={query} onChange={({ target: { value } }) => setQuery(value) } />
            <button>Search</button>
        </form>
    </div>);
}

export default SearchField;