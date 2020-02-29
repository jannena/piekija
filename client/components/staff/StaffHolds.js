import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getHolds } from "../../reducers/circulationReducer";
import __ from "../../langs";
import Select from "../Select";
import { Link } from "react-router-dom";
import Loader from "../Loader";

const StaffHolds = ({ state, holds, locations, getHolds, currentLocation, __ }) => {
    const handleGetHolds = e => {
        e.preventDefault();
        const { location: { value: location = "" } } = e.target;
        getHolds(location);
    };

    return <div>
        <form onSubmit={handleGetHolds}>
            <Select name="location" defaultSelected={currentLocation} options={[[`--- ${__("Select location")} ---`, null], ...locations.map(l => [l.name, l.id])]} />
            <button>{__("Get")}</button>
        </form>
        <hr />
        {state.state === 4 && <Loader />}
        {state.state === 6 && <p>{__("Error")}: {__(state.error)}</p>}
        {holds && holds.map(hold => <div style={{ marginTop: 20 }}>
            <div><Link to={`/staff/record/${hold.record.id}`}>{hold.record.title}</Link></div>
            <div style={{ marginLeft: 10 }}>
                <div>{__("Holds")}: {hold.queue}</div>
                <div>{__("Shelf location")}: {hold.shelfLocation}</div>
                <div>{__("For")}: {hold.record.for}</div>
                <div>{__("Pick-up location")}: {hold.pickupLocation.name}</div>
            </div>
        </div>)}
    </div>;
};

export default connect(
    state => ({
        holds: state.circulation.holds,
        locations: state.location,
        currentLocation: state.currentLocation,
        state: state.loading.circulation_holds,
        __: __(state)
    }),
    { getHolds }
)(StaffHolds);