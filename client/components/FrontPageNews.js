import React from "react";
import { connect } from "react-redux";
import Loader from "./Loader";
import __ from "../langs";

const FrontPageNews = ({ news, __ }) => {
    if (!news) return <Loader />;

    const printDate = date => {
        const d = new Date(date);
        return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
    }

    return <>
        <h1>Welcome</h1>
        {news.map(n => <div key={n.id} style={{ borderTop: "1px solid black", marginBottom: 20 }}>
            <h3>{n.title}</h3>
            <div>{__("Created on")} {printDate(n.created)}, {__("Updated on")} {printDate(n.modified)}</div>
            <br />
            <div>{n.content.split("\n").map(row => <span>{row} <br /></span>)}</div>
        </div>)}
    </>;
};

export default connect(
    state => ({
        news: state.notes,
        __: __(state)
    })
)(FrontPageNews);