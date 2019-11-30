import React from "react";
import Select from "./Select";
import RecordPreview from "./RecordPreview";
import { connect } from "react-redux";
import { nextPage, previousPage, resort } from "../reducers/queryReducer";
import Loader from "./Loader";
import Expandable from "./essentials/Expandable";
import { Columns, Column } from "./essentials/Columns";
import SearchFilter from "./SearchFilter";
import __ from "../langs";

const resultsPerPage = 20;

const Search = ({ state, type, result, page, sort, nextPage, previousPage, resort, __ }) => {

    const handleResort = e => {
        resort(e.target.value);
    };

    console.log("rendered search");
    console.log("sivulla", page, !page || page === 1);
    console.log("doNotShowNextPageLink?", result.found / 3 <= page);

    if (state.state === 0) return <p>{__("Givethesearchquery")}</p>;
    if (state.state === 1) return <Loader />;
    if (state.state === 3) return <p>{__("Error")}: {state.error}</p>;

    // TODO: Fast page selector
    const howManyPages = Math.ceil(((result && result.found) || 0) / resultsPerPage);

    return (
        <div>
            {result.result.length === 0
                ? `${__("No results")} ${__("in-before-milliseconds")} ${result.time && ` ${result.time} ${__("in-milliseconds")}`}`
                : <>
                    <p>{__("Found")} {result.found} {__("records-in")} {__("in-before-milliseconds")} {(result.time || NaN).toFixed(0)} {__("in-milliseconds")}</p>
                    <div>
                        {/* <Select onChange={handleResort} defaultSelected={sort} options={
                            type === "advanced"
                                ? [["Year (newest first)", "year"], ["Latest added first", "timeAdded"]]
                                : [["Relevance", "relevance"], ["Year (newest first)", "year"], ["Latest added first", "timeAdded"]]
                        } /> */}
                        <Select onChange={handleResort} defaultSelected={sort}
                            options={[[__("sortbyyear"), "year"], [__("sortbyyeardesc"), "yeardesc"], [__("sortbyalphapetical"), "alphapetical"], [__("sortbyalphapeticaldesc"), "alphapeticaldesc"], [__("sortbytimeadded"), "timeAdded"]]}
                        />
                    </div>
                    <SearchFilter />
                    {/* TODO: Print also where was the match?? Not possible yet */}
                    {result.result.map(record => <RecordPreview key={record.id} record={record} />)}
                    <div style={{ textAlign: "center", lineHeight: "50px" }}>
                        {page >= 2 && <a href="javascript:void(0);" onClick={previousPage}>&lt;&lt; {__("Previous")}</a>}
                        | {__("Page")} {page} / {howManyPages} |
                        {(result.found > page * resultsPerPage) && <a href="javascript:void(0);" onClick={nextPage}>{__("Next")} &gt;&gt;</a>}
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
        type: state.query.type,
        __: __(state)
    }),
    { nextPage, previousPage, resort }
)(Search);