import React, { useState, useEffect } from "react";
import searchService from "../services/searchService";
import SearchField from "./SearchField";
import qs from "query-string";
import { Link } from "react-router-dom";
import AdvancedSearch from "./AdvancedSearch";

const Search = ({ queryParams, history }) => {
    const [result, setResult] = useState([]);
    const query = qs.parse(queryParams).q;

    console.log("rendered search");

    useEffect(() => {
        if (query) onSearch(query);
    }, [query]);

    const onSearch = query => {
        history.push({
            pathname: "/search",
            search: `?q=${encodeURI(query)}`
        });
        searchService
            .simpleSearch(query)
            .then(result => {
                setResult(result);
            })
            .catch(err => {
                console.log("VIRHE hakutuloksia haettaessa", err, err.message);
            });
        console.log("requested search results");
    };

    return (
        <div>
            <SearchField onSearch={onSearch} />
            <AdvancedSearch />
            <hr />
            {result.length === 0
                ? (!query ? "^" : `No results for ${query}`)
                : result.map(record => <p key={record._id}><Link to={`/record/${record._id}`}>{record.title}</Link></p>)}
        </div>
    );
};

export default Search;
