import React from "React";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { returnItemWithId, renewItemWithId } from "../../reducers/circulationReducer";
import __ from "../../langs";

const Loan = ({ loan, staff = false, returnItemWithId, renewItemWithId, __ }) => {
    const dateString = __("date-format")(new Date(loan.stateDueDate));

    const renewTimes = loan.loantype.renewTimes - loan.stateTimesRenewed;

    return (<div className="loan">
        <hr />
        <div><Link to={`${staff === true ? "/staff" : ""}/record/${loan.record.id}`}>{loan.record.title}</Link> {staff ? <span>({loan.barcode})</span> : null}</div>
        <div>{__("Due date")}: {dateString}</div>
        {staff && <div>{__("Location")}: {loan.location.name}</div>}
        <div>{__("Renew times left")}: {renewTimes}</div>
        {staff && <button className="return-button" onClick={() => returnItemWithId(loan.id)}>{__("return-button")}</button>}
        {renewTimes > 0 && <button className="renew-button" onClick={() => renewItemWithId(loan.id)}>{__("renew-button")}</button>}
    </div>);
};

export default connect(
    state => ({
        __: __(state)
    }),
    { returnItemWithId, renewItemWithId }
)(Loan);