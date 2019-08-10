import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useField } from "../hooks";
import userService from "../services/userService";

const UpdateUserInfoForm = ({ token, setUser }) => {
    const name = useField("text");
    const newPassword = useField("password");
    const newPasswordAgain = useField("password");
    const oldPassword = useField("password");

    const handleUserUpdate = e => {
        e.preventDefault();
        userService
            .updateMe({
                name: name.value,
                password: newPassword.value,
                oldPassword: oldPassword.value
            }, token)
        .then(result => {
            console.log(result);
            setUser(result);
            name.reset();
            newPassword.reset();
            newPasswordAgain.reset();
            oldPassword.reset();
        })
        .catch(err => {
            console.log(err, err.response.data.error);
        });
    };

    return (<form onSubmit={handleUserUpdate}>
        <div>
            <label>name</label>
            <input {...name.props} />
        </div>
        <div>
            <label>new passsword</label>
            <input {...newPassword.props} />
            {(newPassword.value.length > 0 && newPassword.value.length < 10) && <p>Too short</p>}
        </div>
        <div>
            <label>new password again</label>
            <input {...newPasswordAgain.props} />
            {(newPasswordAgain.value.length > 0 && newPassword.value !== newPasswordAgain.value) && <p>Passwords do not match</p>}
        </div>
        <div>
            <label>old password</label>
            <input {...oldPassword.props} />
        </div>
        <div>
            <button>save</button></div>
    </form>);
};

const UserInfo = ({ user, setUser, token }) => {
    if (!user) return <div></div>;

    return (
        <div>
            <h2>{user.name}</h2>
            <div>{user.username}</div>
            <div>{user.barcode}</div>
            <h3>Loans</h3>
            <ul>
                {user.loans.map(loan => <li key={loan.title}>{JSON.stringify(loan)}</li>)}
            </ul>
            <h3>Shelves</h3>
            <ul>
                {user.shelves.map(shelf => shelf.id ? <li key={shelf.id.id}><Link to={`/shelf/${shelf.id.id}`}>{shelf.id.name}</Link></li> : null)}
            </ul>

            <h3>Change your information</h3>
            <UpdateUserInfoForm token={token} setUser={setUser} />
            
        </div>
    );
};

export default UserInfo;