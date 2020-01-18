import React from "react";
import { connect } from "react-redux";
import Loader from "./Loader";
import __ from "../langs";

const FrontPageNews = ({ news, __ }) => {
    document.title = `${__("title-Frontpage")} - ${__("PieKiJa")}`;

    if (!news) return <Loader />;

    const printDate = date => {
        const d = new Date(date);
        return `${__("date-format")(d)} ${__("time-format")(d)}`;
    }

    return <>
        <h1>{__("Welcome")}</h1>
        {news.map(n => <div key={n.id} style={{ borderTop: "1px solid black", marginBottom: 20 }}>
            <h2>{n.title}</h2>
            <div style={{ color: "grey" }}>{__("Created on")} {printDate(n.created)}, {__("Updated on")} {printDate(n.modified)}</div>
            <br />
            <div style={{ padding: "10px 35px" }}>{n.content.split("\n").map(row => <span>{row} <br /></span>)}</div>
        </div>)}
    </>;
};

export default connect(
    state => ({
        news: state.notes,
        __: __(state)
    })
)(FrontPageNews);