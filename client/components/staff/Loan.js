import React from "React";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { returnItemWithId, renewItemWithId } from "../../reducers/circulationReducer"

const Loan = ({ loan, staff = false, returnItemWithId, renewItemWithId }) => {
    const date = new Date(loan.item.stateDueDate);
    const dateString = `${date.getUTCDay()}.${date.getUTCMonth()}.${date.getUTCFullYear()}`;

    const returnLoan = () => { };

    return (<div>
        <hr />
        <div><Link to={`/staff/record/${loan.item.record.id}`}>{loan.item.record.title}</Link> ({loan.item.barcode})</div>
        <div>Due date: {dateString}</div>
        <div>Location: {loan.item.location.name}</div>
        <div>Renew times left: {/* TODO:  */}</div>
        {staff && <button onClick={() => returnItemWithId(loan.item.id)}>Return</button>}
        <button onClick={() => renewItemWithId(loan.item.id)}>Renew</button>
    </div>);
};

export default connect(
    null,
    { returnItemWithId, renewItemWithId }
)(Loan);