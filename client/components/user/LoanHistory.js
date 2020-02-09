import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getLoanHistory } from "../../reducers/userReducer";
import { Link } from "react-router-dom";
import __ from "../../langs";
import { useField } from "../../hooks";
import { setLH } from "../../reducers/userReducer";

const LoanHistory = ({ user, getLoanHistory, setLH, __ }) => {
    useEffect(() => {
        if (!user.loanHistory) getLoanHistory();
    }, []);

    const oldPassword = useField("password");

    if (!user.loanHistory) return null;

    const handleLHChange = enable => () => {
        setLH(oldPassword.value, enable);
        oldPassword.reset();
    };

    return (
        <>
            <div>
                <div>{user.loanHistoryRetention && __("loan-history-warning")}</div>
                <div>{__("Current password")} <input {...oldPassword.props} /></div>
                {user.loanHistoryRetention
                    ? <p>{__("Enabled")} <button onClick={handleLHChange(false)}>{__("Disable")}</button></p>
                    : <p>{__("Disabled")} <button onClick={handleLHChange(true)}>{__("Enable")}</button></p>
                }
            </div>
            <h2>{__("Loan history")}</h2>
            {user.loanHistory.map(loan =>
                <div>
                    <hr />
                    <div><Link to={`/record/${loan.record.id}`}>{loan.record.title}</Link></div>
                    <div>{__("Loaned on")}: {__("date-format")(new Date(loan.loaned))}</div>
                    <div>{__("Returned on")}: {loan.returned ? __("date-format")(new Date(loan.returned)) : __("loaned")}</div>
                </div>)}
        </>
    );
};

export default connect(
    state => ({
        user: state.user,
        __: __(state)
    }),
    { getLoanHistory, setLH }
)(LoanHistory);