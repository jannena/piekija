import React, { useState } from "react";
import loginService from "../services/loginService";

const Login = () => {
    const [use2fa, setUse2fa] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");

    const handleLogin = e => {
        e.preventDefault();
        loginService
            .login(username, password, code)
            .then(result => {
                console.log("successful login", result);
                setUsername("");
                setPassword("");
                setCode("");
            })
            .catch(err => {
                console.log(err.response.data);
                if (err.response.data.error === "code needed") {
                    console.log("code needed");
                    setUse2fa(true);
                }
            });
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
                <label>Username</label>
                <input value={username} onChange={e => setUsername(e.target.value)} />

                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />

                {use2fa && <>
                    <label>2-factor authentication code</label>
                    <input value={code} onChange={e => setCode(e.target.value)} />
                </>}

                <button>Login</button>
            </form>
        </div>
    );
};

export default Login;