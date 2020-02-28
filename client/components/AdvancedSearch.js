import React, { useState, useEffect } from "react";
import Select from "./Select";
import { connect } from "react-redux";
import { setQuery } from "../reducers/queryReducer";
import Expandable from "./essentials/Expandable";
import { Button } from "./essentials/forms";
import __ from "../langs";

const QueryGroupStyle = {
    border: "1px solid black",
    backgroundColor: "grey",
    margin: 10,
    padding: 10
};

const MARC21 = require("../../server/utils/marc21parser");

const AdvancedSearchField = ({ query, setQuery, removeField, __ }) => {
    const onChange = index => e => {
        // const newQuery = [...query];
        // newQuery[index] = e.target.value
        query[index] = e.target.value;
        setQuery(query);
        console.log("writing to an input", query, JSON.stringify(query), setQuery.toString());
    };
    const operatorsByField = field => {
        return {
            year: [[__("is exactly"), "is"], [__("is not"), "not"], [__("is less than"), "lt"], [__("is greater than"), "gt"]]
        }[field] || [
                [__("is exactly"), "is"],
                [__("is not"), "not"]
            ];
    };
    const optionsByField = (field, value, onChange) => {
        const languageOptions = [["-", ""], ...MARC21.languages.map(l => [__(`lang-${l}`, l), l])];
        const countryOptions = [["-", ""], ...MARC21.countries.map(l => [__(`coun-${l}`, l), l])];
        return {
            "language": <Select options={languageOptions} value={value} onChange={onChange(1)} />,
            "languages": <Select options={languageOptions} value={value} onChange={onChange(1)} />,
            "country": <Select options={countryOptions} value={value} onChange={onChange(1)} />,
            "contentType": <Select options={MARC21.contentTypes.map(c => [__(c), c])} value={value} onChange={onChange(1)} />
        }[field]
            || <input
                value={value}
                onChange={onChange(1)}
                className="advanced-search-value"
            />
    };
    return (
        <div>
            <Select
                options={[
                    [__("everything"), "spelling"],
                    [__("content type"), "contentType"],
                    [__("title"), "title"],
                    [__("subject"), "subjects"],
                    [__("author"), "authors"],
                    [__("year"), "year"],
                    [__("country"), "country"],
                    [__("standard code (ISBN/ISSN/...)"), "standardCodes"],
                    [__("series"), "series"],
                    [__("classification"), "classification"],
                    [__("main language"), "language"],
                    [__("language"), "languages"]
                ]}
                selected={query[0]}
                onChange={onChange(0)}
                className="advanced-search-operator"
            />
            <Select
                options={operatorsByField(query[0])}
                selected={query[2]}
                onChange={onChange(2)}
                className="advanced-search-verb"
            />
            {optionsByField(query[0], query[1], onChange)}
            <button className="advanced-search-remove-field" type="button" onClick={removeField}>{__("Remove field")}</button>
        </div>
    );
};

// This is a recursive component
const AdvancedSearchGroup = ({ query, setQuery, removeGroup, __ }) => {
    // Event handlers for new group and field addition
    const addToThisLevel = toBeAdded => {
        const updatedQuery = [...query];
        console.log("Here I am", updatedQuery, JSON.stringify(updatedQuery));
        updatedQuery[1].push(toBeAdded);
        setQuery(updatedQuery);
    };
    const addNewField = () => addToThisLevel(["spelling", "", "is"]);
    const addNewGroup = () => addToThisLevel(["AND", []]);

    // console.log(setQuery.toString());

    return (
        <div className="advanced-search-group" style={QueryGroupStyle}>
            <Select
                options={[[__("withallthese(and)"), "AND"], [__("withanyofthese(or)"), "OR"]]}
                selected={query[0]}
                onChange={e => {
                    query[0] = e.target.value;
                    setQuery(query);
                }}
                className="advanced-search-group-verb"
            />
            <button className="advanced-search-add-field" type="button" onClick={addNewField}>{__("AddFIELD")}</button>
            <button className="advanced-search-add-group" type="button" onClick={addNewGroup}>{__("AddGROUP")}</button>
            {removeGroup && <button onClick={removeGroup}>{__("removethisgroup")}</button>}
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
                    __={__}
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
                    __={__}
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

const AdvancedSearch = ({ query: q, setQuery: setQ, __ }) => {
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
        <Expandable noPadding={true} title={__("advancedsearch")}>
            <form onSubmit={search}>
                <AdvancedSearchGroup
                    query={query}
                    setQuery={newQuery => {
                        console.log("updatedQuery", newQuery, JSON.stringify(newQuery));
                        setQuery([...newQuery]);
                    }}
                    __={__}
                />
                <Button className="advanced-search-button" title={__("Search-button")} />
                {/* <button type="submit" onClick={search}>Search</button> */}
            </form>
        </Expandable>
    );
};

export default connect(
    state => ({
        query: state.query.type === "advanced" ? state.query.query : null,
        __: __(state)
    }),
    { setQuery }
)(AdvancedSearch);