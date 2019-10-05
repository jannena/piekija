import React from "react";
import { connect } from "react-redux";
import { searchForUser, clearUser, createUser, updateUser } from "../../reducers/circulationReducer";
import Loan from "./Loan";
import { Tabs, Tab } from "../Tabs";

const StaffUser = ({ users, clearUser, user, searchForUser, createUser, updateUser }) => {
    const handleUserSearch = e => {
        e.preventDefault();
        const { barcode, name } = e.target;
        if (!barcode.value && !name.value) return console.log("Barcode and name ar missing");
        const query = barcode.value ? { barcode: barcode.value } : { name: name.value }
        searchForUser(query);
    };
    const handleCreateNewUser = () => {
        createUser();
    };
    const handleUpdateUser = e => {
        e.preventDefault();
        const { name, username, barcode, password } = e.target;
        updateUser(name.value, username.value, barcode.value, password.value);
    };

    return (
        <>
            {!user && <>
                <div>
                    <form onSubmit={handleUserSearch}>
                        <div>Barcode: <input name="barcode" /></div>
                        <div>Name: <input name="name" /></div>
                        <div><button>Search</button></div>
                    </form>
                </div>
                <hr />
                <div><button onClick={handleCreateNewUser}>Create new user</button></div>
            </>}
            {/* TODO: User list */}
            {user && <Tabs titles={["Loans |", " Edit"]}>
                <Tab>
                    <div>
                        <button onClick={clearUser}>Clear</button>
                        <div>Name: {user.name}</div>
                        <div>Barcode: {user.barcode}</div>
                        <div>Loans: {user.loans.length}</div>
                        <div>{user.loans.map(loan => <Loan key={loan.id} loan={loan} staff={true} />)}</div>
                    </div>
                </Tab>
                <Tab>
                    <h3>Edit</h3>
                    <form onSubmit={handleUpdateUser}>
                        <div>name: <input defaultValue={user.name} name="name" /></div>
                        <div>username: <input defaultValue={user.username} name="username" /></div>
                        <div>barcode: <input defaultValue={user.barcode} name="barcode" /></div>
                        <div>password: <input type="password" name="password" /></div>
                        <button>Save</button>

                        {/* TODO: 
                        address: <input username="address" />
                        email: <input username="email" />
                        phone: <input username="phone" />*/}
                    </form>
                </Tab>
            </Tabs>}
        </>
    );
};

export default connect(
    state => ({
        user: state.circulation.user
    }),
    { searchForUser, clearUser, createUser, updateUser }
)(StaffUser);