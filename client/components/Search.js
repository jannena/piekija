import React from "react";
import Select from "./Select";
import RecordPreview from "./RecordPreview";
import { connect } from "react-redux";
import { nextPage, previousPage, resort } from "../reducers/queryReducer";
import Loader from "./Loader";

const resultsPerPage = 3;

const Search = ({ state, type, result, page, sort, nextPage, previousPage, resort }) => {

    const handleResort = e => {
        resort(e.target.value);
    };

    console.log("rendered search");
    console.log("sivulla", page, !page || page === 1);
    console.log("doNotShowNextPageLink?", result.found / 3 <= page);

    if (state.state === 0) return <p>Give the search query</p>;
    if (state.state === 1) return <Loader />;
    if (state.state === 3) return <p>Error: {state.error}</p>;

    return (
        <div>
            {/* Order by {<Select options={[["default", "default"], ["time added", "timeAdded"], ["year", "year"], ["alphapetical", "a"]]} />} */}

            {result.result.length === 0
                ? `No results in${result.time && ` ${result.time} ms`}`
                : <>
                    <p>Found {result.found} records in {(result.time || NaN).toFixed(0)} milliseconds</p>
                    <div>
                        <Select onChange={handleResort} defaultSelected={sort} options={
                            type === "advanced"
                                ? [["Year (newest first)", "year"], ["Latest added first", "timeAdded"]]
                                : [["Relevance", "relevance"], ["Year (newest first)", "year"], ["Latest added first", "timeAdded"]]
                        } />
                    </div>
                    {/* TODO: Print also where was the match?? Not possible yet */}
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
        state: state.loading.search,
        sort: state.query.sort,
        type: state.query.type
    }),
    { nextPage, previousPage, resort }
)(Search);
