import React from "React";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { returnItemWithId, renewItemWithId } from "../../reducers/circulationReducer"

const Loan = ({ loan, staff = false, returnItemWithId, renewItemWithId }) => {
    const date = new Date(loan.stateDueDate);
    const dateString = `${date.getUTCDate()}.${date.getUTCMonth() + 1}.${date.getUTCFullYear()}`;

    const renewTimes = loan.loantype.renewTimes - loan.stateTimesRenewed;

    return (<div>
        <hr />
        <div><Link to={`/staff/record/${loan.record.id}`}>{loan.record.title}</Link> ({loan.barcode})</div>
        <div>Due date: {dateString}</div>
        {staff && <div>Location: {loan.location.name}</div>}
        <div>Renew times left: {renewTimes}</div>
        {staff && <button onClick={() => returnItemWithId(loan.id)}>Return</button>}
        {renewTimes > 0 && <button onClick={() => renewItemWithId(loan.id)}>Renew</button>}
    </div>);
};

export default connect(
    null,
    { returnItemWithId, renewItemWithId }
)(Loan);