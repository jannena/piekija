import React, { useState, useEffect } from "react";
import Select from "./Select";

const QueryGroupStyle = {
    border: "1px solid black",
    backgroundColor: "grey",
    margin: 10,
    padding: 10
};

const AdvancedSearchField = ({ query, setQuery }) => {
    const onChange = index => e => {
        // const newQuery = [...query];
        // newQuery[index] = e.target.value
        query[index] = e.target.value;
        setQuery(query);
        console.log("writing to an input", query, JSON.stringify(query), setQuery.toString());
    };
    return (
        <div>
            <input
                value={query[1]}
                onChange={onChange(1)}
            />
            <Select
                options={[["is exactly", "is"], ["is a piece of", "contains"]]}
                selected={query[2]}
                onChange={onChange(2)}
            />
            <Select
                options={[["everything", "record"], ["title", "title"], ["subject", "subjects"], ["author", "authors"]]}
                selected={query[0]}
                onChange={onChange(0)}
            />
        </div>
    );
};

// This is a recursive component
const AdvancedSearchGroup = ({ query, setQuery }) => {
    // Event handlers for new group and field addition
    const addToThisLevel = toBeAdded => {
        const updatedQuery = [...query];
        console.log("Here I am", updatedQuery, JSON.stringify(updatedQuery));
        updatedQuery[1].push(toBeAdded);
        setQuery(updatedQuery);
    };
    const addNewField = () => addToThisLevel(["record", "", "contains"]);
    const addNewGroup = () => addToThisLevel(["and", []]);

    // console.log(setQuery.toString());

    return (
        <div style={QueryGroupStyle}>
            <button onClick={addNewField}>Add new FIELD to this group</button>
            <button onClick={addNewGroup}>Add new GROUP to this group</button>
            <Select
                options={[["with all these (and)", "and"], ["with any of these (or)", "or"]]}
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
                />

                : <AdvancedSearchField
                    key={i}
                    query={q}
                    setQuery={newQuery => {
                        const updatedQuery = [...query];
                        updatedQuery[1][i] = newQuery;
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
const AdvancedSearch = ({ onSearch, query: q }) => {
    const [query, setQuery] = useState(["and", []]);

    useEffect(() => {
        if (q) setQuery(JSON.parse(q));
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