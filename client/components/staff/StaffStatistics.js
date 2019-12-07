import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getNotLoanedSince, getTotal } from "../../reducers/statisticsReducer";
import { getLocations } from "../../reducers/locationReducer";
import __ from "../../langs";
import { Form, FormSelect, Input, Button } from "../essentials/forms";
import Expandable from "../essentials/Expandable";

const StaffStatistics = ({ getLocations, locations, getNotLoanedSince, getTotal, language, statistics, __ }) => {
    useEffect(() => {
        if (!locations || locations.length === 0) getLocations();
    }, []);

    const handleGetTotal = e => {
        e.preventDefault();
        getTotal();
    };

    const handleGetNotLoanedSince = e => {
        const { location, date } = e.target;
        getNotLoanedSince(location.value, null, date.value, language);
    };

    return <>
        <div>How many things in total</div>
        <button onClick={handleGetTotal}>Get</button>
        {statistics && statistics.total && <>
            <div>Items: {statistics.total.items}</div>
            <div>Records: {statistics.total.records}</div>
            <div>Users: {statistics.total.users}</div>
        </>}
        <hr />
        <Expandable title={__("Total loans")}>
            <p>Coming soon</p>
        </Expandable>
        
        <Expandable title={__("Not loaned since")}>
            <Form onSubmit={handleGetNotLoanedSince}>
                <FormSelect options={locations.map(l => [l.name, l.id]) || []} name="location" id="location" title={__("Location")} />
                <Input type="date" name="date" id="date" title={__("Date")} description={__("Date since item has not been loaned")} />
                <Button title={__("Get loans")} />
            </Form>
        </Expandable>
    </>;
};

export default connect(
    state => ({
        locations: state.location,
        language: state.language,
        statistics: state.statistics,
        __: __(state)
    }),
    { getTotal, getNotLoanedSince, getLocations }
)(StaffStatistics);