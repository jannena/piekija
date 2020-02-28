import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { removeReview } from "../reducers/recordReducer";
import __ from "../langs";

const Review = ({ __, removeReview, review, record = false, user = false, showRemove, forceRemoveReview = false }) => {
    return <>
        <div>
            {record && <div><Link to={`/record/${review.record.id}`}>{review.record.author}{review.record.author ? ": " : ""}{review.record.title}</Link></div>}
            {user && <div><b>{review.reviewer.name}</b> ({review.timeAdded && <span>{__("date-format")(new Date(review.timeAdded))}</span>})</div>}

            <div style={{ padding: 5, paddingLeft: 0 }}>{__("Score")}: {review.score}</div>
            <div style={{ padding: 5 }}>{review.review.split("\n").map(row => <span>{row} <br /></span>)}</div>
            {(showRemove || forceRemoveReview) && <div><button onClick={() => {
                removeReview(typeof review.record === "string" ? review.record : review.record.id, review.id);
            }}>{__("remove-button")}</button></div>}
        </div>
        <hr />
    </>;
};

export default connect(
    (state, ownProps) => ({
        showRemove: (state.user && state.user.id) === (ownProps.review && ownProps.review.reviewer && ownProps.review.reviewer.id),
        __: __(state)
    }),
    { removeReview }
)(Review);