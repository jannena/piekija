import React from "react";
import { setQuery } from "../reducers/queryReducer";
import { connect } from "react-redux";
import Expandable from "./essentials/Expandable";
import { Columns, Column } from "./essentials/Columns";
import __ from "../langs";

const SearchFilter = ({ query, filters, setQuery, __ }) => {
    console.log("!!!!!!!!!!!", filters);
    if (!filters) return <p>{__("cannot-use-search-filter")}</p>;

    // console.log(search);

    const handleSearchFilterClick = (fieldType, value) => () => {
        if (query.type === "advanced") {
            const newQuery = query.query[0] === "AND"
                ? ["AND", [...query.query[1], [fieldType, value, "is"]]]
                : ["AND", [query.query, [fieldType, value, "is"]]]
            setQuery("advanced", newQuery);
        }
        else {
            const newQuery = ["AND", [["spelling", query.query, "is"], [fieldType, value, "is"]]];
            setQuery("advanced", newQuery);
        }
    };
    const searchFilterTemplate = (title, type, data) => <>
        <p>{title}</p>
        <div>
            <ul>
                {data.filter(({ _id }) => _id).map(({ _id, count }) => <li key={_id}>
                    <a href="javascript:void(0)" onClick={handleSearchFilterClick(type, _id)}>{_id} ({count})</a>
                </li>)}
            </ul>
        </div>
    </>;

    console.log("!!!!!!!!!!", filters);
    return <div>
        <Expandable title={__("Filter search")} noPadding={true}>
            <Columns>
                <Column>
                    {searchFilterTemplate(__("Subjects"), "subjects", filters.subjects)}
                </Column>
                <Column>
                    {searchFilterTemplate(__("Authors"), "authors", filters.authors)}
                </Column>
                <Column>
                    {searchFilterTemplate(__("Years"), "year", filters.years)}
                </Column>
                <Column>
                    {searchFilterTemplate(__("Languages"), "languages", filters.languages)}
                </Column>
            </Columns>
        </Expandable>
    </div>;
};

export default connect(
    state => ({
        query: state.query,
        filters: state.search && state.search.result && state.search.result.filters,
        __: __(state)
    }),
    { setQuery }
)(SearchFilter);