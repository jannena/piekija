import React from "react";
import { Link } from "react-router-dom";

const MARC21 = require("../../server/utils/marc21parser");

const RecordPreview = ({ record, __ }) => {
    const previewStyle = {
        height: 150,
        display: "flex",
        border: "1px solid black",
        margin: 10
    };
    const titleStyle = {
        fontSize: "1.4em"
    };
    const imageStyle = {
        width: 130,
        height: 130,
        border: "1px solid black",
        margin: 10
    };
    const infoStyle = {
        width: "70%",
        padding: 10
    };
    return (
        <div style={previewStyle}>
            <div style={imageStyle}><img></img></div>
            <div style={infoStyle}>
                <div style={titleStyle}><strong><Link to={`/record/${record.id}`}>{record.title}</Link></strong></div>
                <div>{__(record.contentType) || null}</div>
                <div>{record.author}</div>
                <div>{Number(record.year) || null}</div>
            </div>
        </div>
    );
};

export default RecordPreview;