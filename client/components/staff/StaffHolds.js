import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getHolds } from "../../reducers/circulationReducer";
import __ from "../../langs";
import Select from "../Select";
import { Link } from "react-router-dom";

const StaffHolds = ({ holds, locations, getHolds, __ }) => {
    const handleGetHolds = e => {
        e.preventDefault();
        const { location: { value: location = "" } } = e.target;
        getHolds(location);
    };

    return <div>
        <form onSubmit={handleGetHolds}>
            <Select name="location" options={[[`--- ${__("Select location")} ---`, null], ...locations.map(l => [l.name, l.id])]} />
            <button>{__("Get")}</button>
        </form>
        <hr />
        {holds && holds.map(hold => <div style={{ marginTop: 20 }}>
            <div><Link to={`/staff/record/${hold.record.id}`}>{hold.record.title}</Link></div>
            <div style={{ marginLeft: 10 }}>
                <div>{__("Shelf location")}: {hold.shelfLocation}</div>
                <div>{__("For")}: {hold.record.for}</div>
            </div>
        </div>)}
    </div>;
};

export default connect(
    state => ({
        holds: state.circulation.holds,
        locations: state.location,
        __: __(state)
    }),
    { getHolds }
)(StaffHolds);