import React from "react";
import { setQuery } from "../reducers/queryReducer";
import { connect } from "react-redux";
import Expandable from "./essentials/Expandable";
import { Columns, Column } from "./essentials/Columns";

const SearchFilter = ({ query, filters, setQuery }) => {
    console.log("!!!!!!!!!!!", filters);
    if (!filters) return <p>Filter cannot be used in this search.</p>;

    // console.log(search);

    const handleSearchFilterClick = (fieldType, value) => () => {
        if (query.type === "advanced") {
            // TODO: What if operator is not AND?
            const newQuery = ["AND", [...query.query[1], [fieldType, value, "is"]]];
            setQuery("advanced", newQuery);
        }
        else {
            // TODO: 
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
        <Expandable title="Filter search" noPadding={true}>
            <Columns>
                <Column>
                    {searchFilterTemplate("Subjects", "subjects", filters.subjects)}
                </Column>
                <Column>
                    {searchFilterTemplate("Authors", "authors", filters.authors)}
                </Column>
                <Column>
                    {searchFilterTemplate("Years", "year", filters.years)}
                </Column>
                <Column>
                    {searchFilterTemplate("Languages", "languages", filters.languages)}
                </Column>
            </Columns>
        </Expandable>
    </div>;
};

export default connect(
    state => ({
        query: state.query,
        filters: state.search && state.search.result && state.search.result.filters
    }),
    { setQuery }
)(SearchFilter);