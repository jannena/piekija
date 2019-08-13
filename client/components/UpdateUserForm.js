import React from "react";
import { connect } from "react-redux";
import { updateUser } from "../reducers/userReducer";
import { useField } from "../hooks";

const UpdateUserForm = ({ updateUser }) => {
    const name = useField("text");
    const newPassword = useField("password");
    const newPasswordAgain = useField("password");
    const oldPassword = useField("password");

    const handleUserUpdate = e => {
        e.preventDefault();
        updateUser(oldPassword.value, name.value, newPassword.value);
        
        name.reset();
        newPassword.reset();
        newPasswordAgain.reset();
        oldPassword.reset();
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

export default connect(
    null,
    { updateUser }
)(UpdateUserForm);