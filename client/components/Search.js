import React from "react";
import SearchField from "./SearchField";
import AdvancedSearch from "./AdvancedSearch";
import Select from "./Select";
import RecordPreview from "./RecordPreview";
import { connect } from "react-redux";
import { nextPage, previousPage } from "../reducers/queryReducer";

const resultsPerPage = 20;

const Search = ({ state, result, page, nextPage, previousPage }) => {

    console.log("rendered search");
    console.log("sivulla", page, !page || page === 1);
    console.log("doNotShowNextPageLink?", result.found / 3 <= page);

    if (state.state === 0) return <p>Give the search query</p>;
    if (state.state === 1) return <p>Searching...</p>;
    if (state.state === 3) return <p>Error: {state.error}</p>;

    return (
        <div>
            {/* Order by {<Select options={[["default", "default"], ["time added", "timeAdded"], ["year", "year"], ["alphapetical", "a"]]} />} */}

            {result.result.length === 0
                ? "No results"
                : <>
                    <p>Found {result.found} records in {(result.time || NaN).toFixed(0)} milliseconds</p>
                    {result.result.map(record => <RecordPreview key={record.id} record={record} />)}
                    <p>
                        {page >= 2 && <button onClick={previousPage}>&lt;&lt; previous</button>}
                        | Page {page} |
                        {(result.found > page * resultsPerPage) && <button onClick={nextPage}>next &gt;&gt;</button>}
                    </p>
                </>}
        </div>
    );
};

export default connect(
    state => ({
        result: state.search.result,
        page: state.query.page,
        state: state.loading.search
    }),
    { nextPage, previousPage }
)(Search);
