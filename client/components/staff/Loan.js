import React from "React";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { returnItemWithId, renewItemWithId } from "../../reducers/circulationReducer";
import __ from "../../langs";

const Loan = ({ loan, staff = false, returnItemWithId, renewItemWithId, __ }) => {
    const date = new Date(loan.stateDueDate);
    const dateString = `${date.getUTCDate()}.${date.getUTCMonth() + 1}.${date.getUTCFullYear()}`;

    const renewTimes = loan.loantype.renewTimes - loan.stateTimesRenewed;

    return (<div>
        <hr />
        <div><Link to={`${staff === true ? "/staff" : ""}/record/${loan.record.id}`}>{loan.record.title}</Link> {staff ? <span>({loan.barcode})</span> : null}</div>
        <div>{__("Due date")}: {dateString}</div>
        {staff && <div>{__("Location")}: {loan.location.name}</div>}
        <div>{__("Renew times left")}: {renewTimes}</div>
        {staff && <button onClick={() => returnItemWithId(loan.id)}>{__("return-button")}</button>}
        {renewTimes > 0 && <button onClick={() => renewItemWithId(loan.id)}>{__("renew-button")}</button>}
    </div>);
};

export default connect(
    state => ({
        __: __(state)
    }),
    { returnItemWithId, renewItemWithId }
)(Loan);