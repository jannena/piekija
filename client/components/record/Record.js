import React, { useEffect } from "react";
import { Tabs, Tab } from "../Tabs";
import MARC21Screen from "./MARC21Screen";
import RecordLanguages from "./RecordLanguages";
import RecordNotes from "./RecordNotes";
import RecordTime from "./RecordTime";
import RecordClassification from "./RecordClassification";
import RecordStandardCodes from "./RecordStandardCodes";
import RecordSubjects from "./RecordSubjects";
import RecordTools from "./RecordTools";
import { connect } from "react-redux";
import { getRecord, review } from "../../reducers/recordReducer";
import { placeAHold } from "../../reducers/circulationReducer";
import Loader from "../Loader";
import RecordPublisherInfo from "./RecordPublisherInfo";
import RecordAuthors from "./RecordAuthors";
import styled from "styled-components";
import ShowMore from "../essentials/ShowMore";
import "../../css/record.css";
import __ from "../../langs";
import Select from "../Select";
import Review from "../Review";
import Expandable from "../essentials/Expandable";
import { Form, Checkbox, FormSelect, Textarea, Button } from "../essentials/forms";

const MARC21 = require("../../../server/utils/marc21parser");
const { removeLastCharacters } = require("../../../server/utils/stringUtils");

const StyledTBody = styled.tbody`
    border-bottomi: 1px solid black;

    &:after {
        content "";
        height: 5px;
    }
`;

const StyledImageContainer = styled.div`
    width: 100%;
    text-align: center;
    margin-right: 20px;

    @media screen and (min-width: 600px) {
        width: 200px;
    }
`;

const StyledMainInfo = styled.div`
    width: 100%;

    @media screen and (min-width: 600px) {
        width: calc(100% - 220px);
    }
`;

const Record = ({ state, isLoggedIn, isAdmin, record, getRecord, id, history, isPreview, isRecordInUsersHolds, placeAHold, locations, review, __ }) => {
    console.log(id);
    console.log("record", record);

    useEffect(() => {
        console.log(id);
        if (!isPreview) {
            getRecord(id);
        }
    }, [id]);

    if (!record || !record.record || !record.record.LEADER || !record.record.FIELDS) return <div>
        {__("Error")}: {__("record corrupted or not found")}
        {isAdmin && <div><a href="javascript:void(0)" onClick={() => history.push(`/staff/record/${id}`)}>{__("Go to admin panel")}</a></div>}
    </div>;

    if (state.state === 0) return null;
    if (state.state === 1) return <Loader />
    if (state.state === 3) return <p>{__("Error")}: {state.error}</p>;

    document.title = `${record.result.title} - ${__("PieKiJa")}`;

    const appearance = MARC21.getSubfields(record.record, "300", ["a", "b", "c", "e", "f", "g"]);
    const series = MARC21.getFieldsAndSubfields(record.record, ["490"], ["a"]).map(s => <div key={s.a}>{s.a}</div>);

    // const spelling = MARC21.getSpelling(record.record);

    const links = MARC21
        .getFieldsAndSubfields(record.record, ["856"], ["indicators", "y", "u", "z"])
        .map(link => <div>
            {console.log("Linkki", link)}
            <a href={link.u} target="_blank">{(link.y && link.y.length > 0) ? link.y : link.z}</a>
        </div>);

    const colorByState = state => {
        if (state === "not loaned") return "#00d400";
        else if (state === "not in use") return "white";
        else return "#ff3c3c";
    };

    const handlePlaceAHold = e => {
        e.preventDefault();
        const { pickup: { value: pickup } } = e.target;
        placeAHold(record.result.id, pickup);
    };

    const handleReview = e => {
        e.preventDefault();
        const { review: r, score, isPublic } = e.target;
        review(Number(score.value) || 3, r.value, isPublic.checked);
    };

    return !record || !record.result || record.result.id !== id
        ? null
        : <div>
            {!isPreview && <RecordTools __={__} record={record} history={history} />}
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {record.result.image && <StyledImageContainer>
                    <img style={{ maxWidth: "100%" }} src={record.result.image} />
                </StyledImageContainer>}
                <StyledMainInfo>
                    {MARC21.getFieldsAndSubfields(record.record, ["245"], ["a", "n", "b", "c"]).slice(0, 1).map(title => <h2 key={title.a[0]}>{`${title.a[0] || ""} ${title.n[0] || ""} ${title.b[0] || ""} ${title.c[0] || ""}`}</h2>)}
                    <div>{record.result.author}</div>
                    <div>
                        {__("Content type")}: {__(record.record.LEADER.substring(6, 7), "Unknown content type")}
                    </div>
                    <RecordTime record={record} />
                    <div style={{ padding: 10 }}>{record.result.description}</div>
                    <div>{__("Average review score")}: {((record.result.totalReviews && record.result.totalReviews.average) || 0).toFixed(2)}</div>
                </StyledMainInfo>
            </div>

            <hr />

            <table className="record-table">
                <ShowMore noDiv={true} buttonContainer={button => <tbody><tr><td style={{ textAlign: "center" }} colSpan={2}>{button}</td></tr></tbody>} show={1} data={[
                    <StyledTBody>
                        <RecordAuthors __={__} record={record} />
                        <RecordSubjects __={__} record={record} />
                    </StyledTBody>,
                    <StyledTBody>
                        <RecordClassification __={__} record={record} />
                        <RecordStandardCodes __={__} record={record} />
                    </StyledTBody>,
                    <StyledTBody>
                        <RecordPublisherInfo __={__} record={record} />
                        {!!series.length && <tr><td>{__("Series")}</td><td>{series}</td></tr>}
                        {!!appearance.length && <tr><td>{__("Appearance")}</td><td>{appearance.join(" ")}</td></tr>}
                        {!!links.length && <tr><td>{__("Links")}</td><td>{links}</td></tr>}
                    </StyledTBody>,

                    <StyledTBody className="record-languages-rows">
                        <RecordLanguages __={__} record={record} />
                    </StyledTBody>,
                    <StyledTBody>
                        <RecordNotes __={__} record={record} />
                    </StyledTBody>
                ]} />

            </table>


            {
                !isPreview && <Tabs titles={[__("Items"), `${__("Reviews")} (${(record.result.totalReviews && record.result.totalReviews.reviews) || 0})`, __("MARC"), __("spelling")]}>
                    <Tab>
                        <table style={{ width: "100%" }}>
                            <tbody>
                                {record.result.items.map((item, i) =>
                                    <tr key={i}>
                                        <td>{item.location.name} ({item.shelfLocation})</td>
                                        <td style={{ backgroundColor: colorByState(item.state || "loaned"), lineHeight: "30px", textAlign: "center" }}>{__(item.state)}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {isLoggedIn && (record.result.items.length > 0
                            ? <><hr /><div>{__("Holds")}: {record.result.holds || 0}</div>
                                {!(isRecordInUsersHolds(record.result.id)[0])
                                    ? <form onSubmit={handlePlaceAHold}>
                                        <Select name="pickup" options={[[__("Select pick-up location"), null], ...locations.map(l => [l.name, l.id])]} />
                                        <button>{__("Place a hold")}</button>
                                    </form>
                                    : <>
                                        <div>{__("Your queue number")}: {isRecordInUsersHolds(record.result.id)[0].queue}</div>
                                        <div>{__("Pick-up location")}: {isRecordInUsersHolds(record.result.id)[0].location.name}</div>
                                    </>}
                            </>
                            : <p>{__("No items")}</p>)}
                    </Tab>
                    <Tab>
                        {isLoggedIn ? <Expandable title={__("Write a review")}>
                            <Form onSubmit={handleReview}>
                                <Textarea name="review" title={__("Review")} />
                                <Checkbox name="isPublic" checked={true} title={__("Is public review?")} />
                                <FormSelect name="score" title={__("Score")} options={[[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6]]} />
                                <Button title={__("review-button")} />
                            </Form>
                        </Expandable> : <p>{__("Log in to write a review.")}</p>}
                        <hr />
                        {record.result.reviews.map(r => <Review key={r.id} review={r} user={true} />)}
                    </Tab>
                    <Tab>
                        <MARC21Screen parsedMARC={record.record} />
                    </Tab>
                    <Tab>
                        <div>Spelling1: {record.result.spelling1.join(", ")}</div>
                        <div>Spelling2: {record.result.spelling2.join(", ")}</div>
                    </Tab>
                </Tabs>
            }
        </div >
};

export default connect(
    state => ({
        isAdmin: state.user && state.user.staff,
        record: state.record.record,
        state: state.loading.record,
        locations: state.location,
        isRecordInUsersHolds: id => state.user && state.user.holds && state.user.holds.some && state.user.holds.filter(({ record: r }) => {
            console.log("TESTTESTTESTTESTTEST", r.id, id);
            return r.id === id
        }),
        isLoggedIn: state.user && state.user.staff && typeof state.user.staff === "boolean",
        __: __(state)
    }),
    { getRecord, placeAHold, review }
)(Record);