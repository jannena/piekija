import React from "react";
import { Link } from "react-router-dom";

const MARC21 = require("../../server/utils/marc21parser");

const RecordPreview = ({ record, __ }) => {
    const printPreviewText = pr => {
        if (!pr) return null;
        return pr.map(p => {
            if (!Array.isArray(p)) return null;
            if (typeof p[1] === "string") return <div>{p[0]} <a href={p[1]} target="_blank">{p[2]}</a></div>;
            else return <div>{p[0]}</div>;
        });
    };
    const previewStyle = {
        minHeight: 150,
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
    const previewTextStyle = {
        margin: 10
    };
    return (
        <div style={previewStyle}>
            <div style={imageStyle}><img></img></div>
            <div style={infoStyle}>
                <div style={titleStyle}><strong><Link to={`/record/${record.id}`}>{record.title}</Link></strong></div>
                <div>{__(record.contentType) || null}</div>
                <div>{record.author}</div>
                <div>{Number(record.year) || null}</div>
                {record.previewText && <div style={previewTextStyle}>{printPreviewText(record.previewText)}</div>}
            </div>
        </div>
    );
};

export default RecordPreview;