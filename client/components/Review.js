import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { removeReview } from "../reducers/recordReducer";
import __ from "../langs";

const Review = ({ __, removeReview, review, record = false, user = false, showRemove, forceRemoveReview = false }) => {
    return <>
        <div>
            {record && <div><Link to={`/record/${review.record.id}`}>{review.record.author}{review.record.author ? ": " : ""}{review.record.title}</Link></div>}
            {user && <div>{review.reviewer.name}</div>}
            {review.timeAdded && <div>{__("date-format")(new Date(review.timeAdded))}</div>}
            <div>{review.review}</div>
            <div>{review.score}</div>
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