import React, { useState, useEffect } from "react";
import Select from "./Select";

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
            year: [["is exactly", "is"], ["is less than", "lt"], ["is greater than", "gt"]]
        }[field] || [
                ["is exactly", "is"],
                ["is piece of", "contains"]
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
                options={[["everything", "record"], ["content type", "contentType"], ["title", "title"], ["subject", "subjects"], ["genre", "genres"], ["author", "authors"], ["year", "year"], ["language", "languages"], ["main language", "language"]]}
                selected={query[0]}
                onChange={onChange(0)}
            />
            <Select
                options={operatorsByField(query[0])}
                selected={query[2]}
                onChange={onChange(2)}
            />
            {optionsByField(query[0], query[1], onChange)}
            <button onClick={removeField}>Remove field</button>
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
            <button onClick={addNewField}>Add new FIELD to this group</button>
            <button onClick={addNewGroup}>Add new GROUP to this group</button>
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

const isJSON = string => {
    try {
        const moi = JSON.parse(string);
        console.log("moii", moi);
    }
    catch (err) {
        return false;
    }
    return true;
};

const AdvancedSearch = ({ onSearch, query: q }) => {
    const [query, setQuery] = useState(["AND", []]);

    console.log("query here", query);
    // console.log(query[0]);

    useEffect(() => {
        // console.log("parameter q here", q, JSON.parse(q));
        if (q && isJSON(q)) setQuery(JSON.parse(q));
    }, [q]);

    // console.log(query);

    return (
        <div>
            <AdvancedSearchGroup
                query={query}
                setQuery={newQuery => {
                    console.log("updatedQuery", newQuery, JSON.stringify(newQuery));
                    setQuery(newQuery);
                }}
            />
            <button onClick={() => onSearch(query)}>Search</button>
        </div>
    );
};

export default AdvancedSearch;