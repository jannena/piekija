import React from "react";
import { connect } from "react-redux";
import { setTFA } from "../reducers/userReducer";
import { useField } from "../hooks";
import __ from "../langs";

const TFAForm = ({ setTFA, tfa, tfaqr, __ }) => {
    const oldPassword = useField("password");

    const handleTFAEnable = () => {
        setTFA(oldPassword.value, true);
        oldPassword.reset();
    };

    const handleTFADisable = () => {
        setTFA(oldPassword.value, false);
        oldPassword.reset();
    };

    return (<>
        {tfaqr && <div>
            <p>{__("scan-qr-code-info")}</p>
            <img id="tfaqr" src={tfaqr} />
        </div>}
        {__("Current password")} <input id="current-password" {...oldPassword.props} />
        {tfa
            ? <p>{__("Enabled")} <button onClick={handleTFADisable}>{__("Disable")}</button></p>
            : <p>{__("Disabled")} <button onClick={handleTFAEnable}>{__("Enable")}</button></p>
        }
    </>);

};

export default connect(
    state => ({
        tfa: state.user.tfa,
        tfaqr: state.user.tfaqr,
        __: __(state)
    }),
    { setTFA }
)(TFAForm);