import React from "react";
import Select from "./Select";
import RecordPreview from "./RecordPreview";
import { connect } from "react-redux";
import { nextPage, previousPage, resort } from "../reducers/queryReducer";
import Loader from "./Loader";
import Expandable from "./essentials/Expandable";
import Columns from "./essentials/Columns";

const resultsPerPage = 20;

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

    // TODO: Fast page selector
    const howManyPages = Math.ceil(((result && result.found) || 0) / resultsPerPage);
    /* const selectPage = () => {
        const array = new Array(5).fill(0);
        return array.map((page, i) => <span>{i}</span>);
    }; */

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
                    <div>
                        <Expandable title="Filter search" noPadding={true}>
                            <Columns>
                                <div>
                                    <p>Subject</p>
                                </div>
                                <div>
                                    <p>Author</p>
                                </div>
                                <div>
                                    <p>Year</p>
                                </div>
                                <div>
                                    <p>Language</p>
                                </div>
                            </Columns>
                        </Expandable>
                    </div>
                    {/* TODO: Print also where was the match?? Not possible yet */}
                    {result.result.map(record => <RecordPreview key={record.id} record={record} />)}
                    <div style={{ textAlign: "center", lineHeight: "50px" }}>
                        {page >= 2 && <a href="javascript:void(0);" onClick={previousPage}>&lt;&lt; Previous</a>}
                        | Page {page} / {howManyPages} |
                        {(result.found > page * resultsPerPage) && <a href="javascript:void(0);" onClick={nextPage}>Next &gt;&gt;</a>}
                    </div>
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
