import React from "react";

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
                {user.shelves.map(shelf => shelf.id ? <li key={shelf.id.id}>{shelf.id.name}</li> : null)}
            </ul>

            <h3>Change your information</h3>
            <form>
                <div>
                    <label>name</label>
                    <input />
                </div>
                <div>
                    <label>new passsword</label>
                    <input type="password" />
                </div>
                <div>
                    <label>new password again</label>
                    <input type="password" />
                </div>
                <div>
                    <label>old password</label>
                    <input type="password" />
                </div>
                <div>
                    <button>save</button></div>
            </form>
        </div>
    );
};

export default UserInfo;