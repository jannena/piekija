import React, { useState } from "react";
import Select from "./Select";

const QueryGroupStyle = {
    border: "1px solid black",
    backgroundColor: "grey",
    margin: 10,
    padding: 10
};

const AdvancedSearchField = ({ query }) => {
    // TODO: onChange function
    return (
        <div>
            <input value={query[1]} />
            <Select
                options={[["is exactly", "is"], ["is a piece of", "contains"]]}
                selected={query[2]}
            />
            <Select
                options={[["everything", "record"], ["title", "title"], ["subject", "subjects"], ["author", "authors"]]}
                selected={query[0]}
            />
        </div>
    );
};

// This is a recursive component
const AdvancedSearchGroup = ({ query, setQuery }) => {
    if (Array.isArray(query[1])) {
        // Event handlers for new group and field addition
        const addToThisLevel = toBeAdded => {
            const newQuery = [...query];
            newQuery[1].push(toBeAdded);
            setQuery(newQuery);
        };
        const addNewField = () => addToThisLevel(["record", "", "contains"]);
        const addNewGroup = () => addToThisLevel(["and", []]);

        console.log(setQuery.toString());

        return (
            <div style={QueryGroupStyle}>
                <button onClick={addNewField}>Add new FIELD to this group</button>
                <button onClick={addNewGroup}>Add new GROUP to this group</button>
                <Select
                    options={[["with all these (and)", "and"], ["with any of these (or)", "or"]]}
                    selected={query[0]}
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
                            const updatedQuery = query[i][1];
                            updatedQuery.push(newQuery);
                            setQuery(updatedQuery);
                        }}
                    />
                    : <AdvancedSearchField key={i} query={q} />
                )}
            </div>
        );
    }
    else {
        return <AdvancedSearchField query={query} />
    }
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
const AdvancedSearch = () => {
    const [query, setQuery] = useState(["and", []]);

    console.log(query);

    const setQueryMock = newQuery => {
        console.log("setted a new query", newQuery);
        return setQuery(newQuery);
    }

    return (
        <div>
            <AdvancedSearchGroup
                query={query}
                setQuery={setQueryMock}
                setQuery={newQuery => {
                    const updatedQuery = [...query, newQuery];
                    setQueryMock(updatedQuery);
                }}
            />
        </div>
    );
};

export default AdvancedSearch;