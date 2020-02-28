import React, { useState } from "react";
import { connect } from "react-redux";
import { tryLogin } from "../reducers/tokenReducer";
import { Redirect } from "react-router-dom";
import __ from "../langs";

import { baseUrl } from "../globals";

const Login = ({ tryLogin, usetfa, user, __ }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");

    if (user !== null) return <Redirect to="/user" />

    document.title = `${__("title-Login")} - ${__("PieKiJa")}`;

    const handleLogin = e => {
        e.preventDefault();
        tryLogin(username, password, code);
        // setUsername("");
        // setPassword("");
        // setCode("");
    };

    const inputStyle = {
        width: "100%",
        marginBottom: 20
    };

    return (
        <div style={{ margin: "auto", width: "100%", maxWidth: 500 }}>
            <form onSubmit={handleLogin}>
                <label for="username">{__("Username")}</label>
                <input style={inputStyle} id="username" value={username} onChange={e => setUsername(e.target.value)} />

                <label for="current-password">{__("Password")}</label>
                <input style={inputStyle} id="current-password" type="password" value={password} onChange={e => setPassword(e.target.value)} />

                {usetfa && <>
                    <label>{__("Two-factor authentication code")}</label>
                    <input style={inputStyle} value={code} onChange={e => setCode(e.target.value)} />
                </>}

                <button id="log-in-button" style={inputStyle}>{__("Log in -button")}</button>
            </form>

            <button onClick={() => {
                document.cookie = "piekija-token=null";
                location.href = `${baseUrl}/google/login`;
            }}>{__("Login with Google")}</button>
        </div>
    );
};

export default connect(
    state => ({
        usetfa: state.token.usetfa,
        user: state.user,
        __: __(state)
    }),
    { tryLogin }
)(Login);