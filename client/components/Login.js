import React, { useState } from "react";
import loginService from "../services/loginService";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { tryLogin } from "../reducers/tokenReducer";

const Login = ({ tryLogin, usetfa }) => {
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
            <Link to="/user">User info</Link>

            <form onSubmit={handleLogin}>
                <label>Username</label>
                <input value={username} onChange={e => setUsername(e.target.value)} />

                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />

                {usetfa && <>
                    <label>2-factor authentication code</label>
                    <input value={code} onChange={e => setCode(e.target.value)} />
                </>}

                <button>Login</button>
            </form>
        </div>
    );
};

export default connect(
    state => ({
        usetfa: state.token.usetfa
    }),
    { tryLogin }
)(Login);