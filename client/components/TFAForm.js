import React from "react";
import { connect } from "react-redux";
import { setTFA } from "../reducers/userReducer";
import { useField } from "../hooks";

const TFAForm = ({ setTFA, tfa, tfaqr }) => {
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
            <p>Scan this QR code with Google Authenticator or other authenticator application.</p>
            <img src={tfaqr} />
        </div>}
        Current password <input {...oldPassword.props} />
        {tfa
            ? <p>Enabled <button onClick={handleTFADisable}>Disable</button></p>
            : <p>Disabled <button onClick={handleTFAEnable}>Enable</button></p>
        }
    </>);

};

export default connect(
    state => ({
        tfa: state.user.tfa,
        tfaqr: state.user.tfaqr
    }),
    { setTFA }
)(TFAForm);