import React from "react";
import { Link } from "react-router-dom";

const Review = ({ review, record = false, user = false }) => {
    return <>
        <div>
            {record && <div><Link to={`/record/${review.record.id}`}>{review.record.author}{review.record.author ? ": " : ""}{review.record.title}</Link></div>}
            {user && <div>{review.reviewer.name}</div>}
            <div>{review.review}</div>
            <div>{review.score}</div>
        </div>
        <hr />
    </>;
};

export default Review;