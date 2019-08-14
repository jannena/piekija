import React, { useState, useEffect } from "react";
import searchService from "../services/searchService";
import SearchField from "./SearchField";
import qs from "query-string";
import { Link } from "react-router-dom";
import AdvancedSearch from "./AdvancedSearch";

const Search = ({ queryParams, history }) => {
    const [result, setResult] = useState([]);

    const { type, q: query, page: p } = qs.parse(queryParams);
    const page = !p ? 1 : Number(p);

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
            }
            else onSearch(query);
        }
    }, [query, page]);

    const onSearch = query => {
        history.push({
            pathname: "/search",
            search: `?type=simple&q=${encodeURIComponent(query)}&page=${page}`
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
            search: `?type=advanced&q=${encodeURIComponent(JSON.stringify(query))}&page=${page}`
        });
        console.log(encodeURI(JSON.stringify(query)));
        console.log(JSON.stringify(query));
        searchService
            .advancedSearch(query, page)
            .then(result => {
                setResult(result.result);
            })
            .catch(err => {
                console.log("VIRHE hakutuloksia haettaessa", err, err.message);
            });
        console.log("requested advanced search results");
    };

    console.log("sivulla", page, !page || page === 1);
    console.log("doNotShowNextPageLink?", result.found / 3 <= page);

    const previousPageLink = () => !page || page === 1 ? null : <Link to={`/search?type=${type}&q=${query}&page=${page - 1}`}>&lt;&lt; Previous</Link>;
    const nextPageLink = () => result.found / 3 <= page ? null : <Link to={`/search?type=${type}&q=${query}&page=${page + 1}`}>Next &gt;&gt;</Link>

    return (
        <div>
            <SearchField onSearch={onSearch} />
            <AdvancedSearch onSearch={onAdvancedSearch} query={query} />
            <hr />
            <p>Found {result.found} records in {(result.time || NaN).toFixed(0)} milliseconds</p>
            {result.length === 0
                ? (!query ? "^" : `No results for ${query}`)
                : result.result.map(record => <p key={record.id}><Link to={`/record/${record.id}`}>{record.title}</Link></p>)}
            <p>
                {previousPageLink()}
                | Page {page} |
                {nextPageLink()}
            </p>
        </div>
    );
};

export default Search;
