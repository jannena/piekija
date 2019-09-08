import React, { useState, useEffect } from "react";
import Select from "./Select";
import { connect } from "react-redux";
import { setQuery } from "../reducers/queryReducer";

const QueryGroupStyle = {
    border: "1px solid black",
    backgroundColor: "grey",
    margin: 10,
    padding: 10
};

const MARC21 = require("../../server/utils/marc21parser");

const AdvancedSearchField = ({ query, setQuery, removeField }) => {
    const onChange = index => e => {
        // const newQuery = [...query];
        // newQuery[index] = e.target.value
        query[index] = e.target.value;
        setQuery(query);
        console.log("writing to an input", query, JSON.stringify(query), setQuery.toString());
    };
    const operatorsByField = field => {
        return {
            year: [["is exactly", "is"], ["is not", "not"], ["is less than", "lt"], ["is greater than", "gt"]]
        }[field] || [
                ["is exactly", "is"],
                ["is not", "not"]
            ];
    };
    const optionsByField = (field, value, onChange) => {
        return {
            "language": <Select options={[["Finnish", "fin"], ["Swedish", "swe"], ["English", "eng"]]} value={value} onChange={onChange(1)} />,
            "contentType": <Select options={Object.entries(MARC21.contentTypes).map(([a, b]) => [b, a])} value={value} onChange={onChange(1)} />
        }[field]
            || <input
                value={value}
                onChange={onChange(1)}
            />
    };
    return (
        <div>
            <Select
                options={[
                    ["everything", "spelling"],
                    ["content type", "contentType"],
                    ["title", "title"],
                    ["subject", "subjects"],
                    ["genre", "genres"],
                    ["author", "authors"],
                    ["year", "year"],
                    ["country", "country"],
                    ["standard code (ISBN/ISSN/...)", "standardCodes"],
                    ["series", "series"],
                    ["classification", "classification"],
                    ["main language", "language"],
                    ["language", "languages"]
                ]}
                selected={query[0]}
                onChange={onChange(0)}
            />
            <Select
                options={operatorsByField(query[0])}
                selected={query[2]}
                onChange={onChange(2)}
            />
            {optionsByField(query[0], query[1], onChange)}
            <button type="button" onClick={removeField}>Remove field</button>
        </div>
    );
};

// This is a recursive component
const AdvancedSearchGroup = ({ query, setQuery, removeGroup }) => {
    // Event handlers for new group and field addition
    const addToThisLevel = toBeAdded => {
        const updatedQuery = [...query];
        console.log("Here I am", updatedQuery, JSON.stringify(updatedQuery));
        updatedQuery[1].push(toBeAdded);
        setQuery(updatedQuery);
    };
    const addNewField = () => addToThisLevel(["record", "", "is"]);
    const addNewGroup = () => addToThisLevel(["AND", []]);

    // console.log(setQuery.toString());

    return (
        <div style={QueryGroupStyle}>
            <button type="button" onClick={addNewField}>Add new FIELD to this group</button>
            <button type="button" onClick={addNewGroup}>Add new GROUP to this group</button>
            {removeGroup && <button onClick={removeGroup}>Remove this group</button>}
            <Select
                options={[["with all these (and)", "AND"], ["with any of these (or)", "OR"]]}
                selected={query[0]}
                onChange={e => {
                    query[0] = e.target.value;
                    setQuery(query);
                }}
            />
            {/* If, second element of the array is an array, element is a group.
                    Else, element is a field
                */}
            { /* TODO: DO NOT USE INDEX AS A KEY!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
            {query[1].map((q, i) => Array.isArray(q[1])
                ? <AdvancedSearchGroup
                    key={i}
                    query={q}
                    // Since this is a recursive component, we must create a new 'setQuery' function
                    setQuery={newQuery => {
                        // console.log("in setQuery function, query[i]", query[i]);
                        const updatedQuery = [...query];
                        updatedQuery[1][i] = newQuery;
                        setQuery(updatedQuery);
                    }}
                    removeGroup={() => {
                        const updatedQuery = [...query];
                        updatedQuery[1].splice(i, 1);
                        setQuery(updatedQuery);
                    }}
                />

                : <AdvancedSearchField
                    key={i}
                    query={q}
                    setQuery={newQuery => {
                        const updatedQuery = [...query];
                        updatedQuery[1][i] = newQuery;
                        setQuery(updatedQuery);
                    }}
                    removeField={() => {
                        const updatedQuery = [...query];
                        updatedQuery[1].splice(i, 1);
                        setQuery(updatedQuery);
                    }}
                />
            )}
        </div>
    );
};

/*
"or", [
        ["authors", "Jansson, Tove", "is"],
        ["title", "Kesäkirja", "contains"],
        ["and", [
            ["or", [
                ["authors", "Maikki", "is"],
                ["record", "Kisuli", "contains"]
            ]],
            ["title", "Juuson", "is"],
            ["authors", "Maikku", "contains"],
        ]]
    ]
*/

const AdvancedSearch = ({ query: q, setQuery: setQ }) => {
    const [query, setQuery] = useState(["AND", []]);

    console.log("query here", query);

    useEffect(() => {
        if (q) setQuery(q);
    }, [q]);

    const search = e => {
        e.preventDefault();
        setQ("advanced", query);
    };

    return (
        <div>
            <form onSubmit={search}>
                <AdvancedSearchGroup
                    query={query}
                    setQuery={newQuery => {
                        console.log("updatedQuery", newQuery, JSON.stringify(newQuery));
                        setQuery(newQuery);
                    }}
                />
                <button type="submit" onClick={search}>Search</button>
            </form>
        </div>
    );
};

export default connect(
    state => ({
        query: state.query.type === "advanced" ? state.query.query : null
    }),
    { setQuery }
)(AdvancedSearch);