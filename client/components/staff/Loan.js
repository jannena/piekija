import React from "React";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { returnItemWithId, renewItemWithId } from "../../reducers/circulationReducer"

const Loan = ({ loan, staff = false, returnItemWithId, renewItemWithId }) => {
    const date = new Date(loan.stateDueDate);
    const dateString = `${date.getUTCDay()}.${date.getUTCMonth()}.${date.getUTCFullYear()}`;

    return (<div>
        <hr />
        <div><Link to={`/staff/record/${loan.record.id}`}>{loan.record.title}</Link> ({loan.barcode})</div>
        <div>Due date: {dateString}</div>
        <div>Location: {loan.location.name}</div>
        <div>Renew times left: {/* TODO:  */}</div>
        {staff && <button onClick={() => returnItemWithId(loan.id)}>Return</button>}
        <button onClick={() => renewItemWithId(loan.id)}>Renew</button>
    </div>);
};

export default connect(
    null,
    { returnItemWithId, renewItemWithId }
)(Loan);