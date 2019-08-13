import React, { useState, useEffect } from "react";
import searchService from "../services/searchService";
import SearchField from "./SearchField";
import qs from "query-string";
import { Link } from "react-router-dom";
import AdvancedSearch from "./AdvancedSearch";

const Search = ({ queryParams, history }) => {
    const [result, setResult] = useState([]);

    const { type, q: query, page: p } = qs.parse(queryParams);
    const page = !p ? 0 : Number(p);

    console.log("rendered search");

    useEffect(() => {
        if (query) {
            if (type === "advanced") {
                try {
                    onAdvancedSearch(JSON.parse(query));
                }
                catch (err) {
                    console.log(err);
                }
                // TODO: read query and set it to advanced search query thing
            }
            else onSearch(query);
        }
    }, [query]);

    const onSearch = query => {
        history.push({
            pathname: "/search",
            search: `?type=simple&q=${encodeURIComponent(query)}`
        });
        searchService
            .simpleSearch(query, page)
            .then(result => {
                console.log("haku", JSON.stringify(result.query));
                setResult(result);
            })
            .catch(err => {
                console.log("VIRHE hakutuloksia haettaessa", err, err.message);
            });
        console.log("requested simple search results");
    };

    const onAdvancedSearch = query => {
        history.push({
            pathname: "/search",
            search: `?type=advanced&q=${encodeURIComponent(JSON.stringify(query))}`
        });
        console.log(encodeURI(JSON.stringify(query)));
        console.log(JSON.stringify(query));
        searchService
            .advancedSearch(query, page)
            .then(result => {
                setResult(result)
            })
            .catch(err => {
                console.log("VIRHE hakutuloksia haettaessa", err, err.message);
            });
        console.log("requested advanced search results");
    };

    const previousPageLink = () => `/search?type=${type}&q=${query}&page=${(page || 1) - 1}`;
    const nextPageLink = () => `/search?type=${type}&q=${query}&page=${(page || 1) + 1}`;

    return (
        <div>
            <SearchField onSearch={onSearch} />
            <AdvancedSearch onSearch={onAdvancedSearch} query={query} />
            <hr />
            {result.length === 0
                ? (!query ? "^" : `No results for ${query}`)
                : result.map(record => <p key={record.id}><Link to={`/record/${record.id}`}>{record.title}</Link></p>)}
            <p>
                <Link to={previousPageLink()}>&lt;&lt; Previous</Link>
                | Page {page - 1 || 1} |
                <Link to={nextPageLink()}>Next &gt;&gt;</Link></p>
        </div>
    );
};

export default Search;
