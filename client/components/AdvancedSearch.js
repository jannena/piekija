import React, { useState } from "react";
import Select from "./Select";

const QueryGroupStyle = {
    border: "1px solid black",
    backgroundColor: "grey",
    margin: 10,
    padding: 10
};

const AdvancedSearchField = ({ query }) => {
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

const AdvancedSearchGroup = ({ query, setQuery }) => {
    if (Array.isArray(query[1])) {
        return (
            <div style={QueryGroupStyle}>
                <button>Add new field to this group</button>
                <button>Add new group to this group</button>
                <Select
                    options={[["with all these (and)", "and"], ["with any of these (or)", "or"]]}
                    selected={query[0]}
                />
                {query[1].map(q => Array.isArray(q[1])
                    ? <AdvancedSearchGroup query={q} />
                    : <AdvancedSearchField query={q} />
                )}
            </div>
        );
    }
    else {
        return <AdvancedSearchField query={query} />
    }
};

const AdvancedSearch = () => {
    const [query, setQuery] = useState(["or", [
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
    ]]);

    console.log(query);

    return (
        <div>
            <AdvancedSearchGroup query={query} />
        </div>
    );
};

export default AdvancedSearch;