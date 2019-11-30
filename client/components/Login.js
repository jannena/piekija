import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { tryLogin } from "../reducers/tokenReducer";
import __ from "../langs";

const Login = ({ tryLogin, usetfa, __ }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");

    const handleLogin = e => {
        e.preventDefault();
        tryLogin(username, password, code);
        // setUsername("");
        // setPassword("");
        // setCode("");
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
                <label>{__("Username")}</label>
                <input value={username} onChange={e => setUsername(e.target.value)} />

                <label>{__("Password")}</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />

                {usetfa && <>
                    <label>{__("Two-factor authentication code")}</label>
                    <input value={code} onChange={e => setCode(e.target.value)} />
                </>}

                <button>{__("Log in -button")}</button>
            </form>
        </div>
    );
};

export default connect(
    state => ({
        usetfa: state.token.usetfa,
        __: __(state)
    }),
    { tryLogin }
)(Login);