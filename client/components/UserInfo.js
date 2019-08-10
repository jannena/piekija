import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useField } from "../hooks";
import userService from "../services/userService";

const UpdateUserInfoForm = () => {
    console.log("What is useField?", useField);
    const name = useField("text");
    const newPassword = useField("password");
    const newPasswordAgain = useField("password");
    const oldPassword = useField("password");

    return (<form>
        <div>
            <label>name</label>
            <input {...name} />
        </div>
        <div>
            <label>new passsword</label>
            <input {...newPassword} />
            {(newPassword.value.length > 0 && newPassword.value.length < 10) && <p>Too short</p>}
        </div>
        <div>
            <label>new password again</label>
            <input {...newPasswordAgain} />
            {(newPasswordAgain.value.length > 0 && newPassword.value !== newPasswordAgain.value) && <p>Passwords do not match</p>}
        </div>
        <div>
            <label>old password</label>
            <input {...oldPassword} />
        </div>
        <div>
            <button>save</button></div>
    </form>);
};

const UserInfo = ({ user }) => {
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
            <UpdateUserInfoForm />
            
        </div>
    );
};

export default UserInfo;