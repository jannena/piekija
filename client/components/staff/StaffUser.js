import React, { useState } from "react";
import { connect } from "react-redux";
import { searchForUser, clearUser, createUser, updateUser, removeUser } from "../../reducers/circulationReducer";
import Loan from "./Loan";
import { Tabs, Tab } from "../Tabs";
import { Form, Input, Button } from "../essentials/forms";
import __ from "../../langs";
import { Link } from "react-router-dom";

const StaffUser = ({ users, clearUser, user, searchForUser, createUser, updateUser, removeUser, __ }) => {
    const [imsure, setImsure] = useState(false);

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

    const handleRemoveUser = e => {
        e.preventDefault();
        removeUser();
    };

    return (
        <>
            {!user && <>
                <div>
                    <form onSubmit={handleUserSearch}>
                        <div>{__("Barcode")}: <input name="barcode" /></div>
                        <div>{__("Name")}: <input name="name" /></div>
                        <div><button>{__("search-button")}</button></div>
                    </form>
                </div>
                <hr />
                <div><button onClick={handleCreateNewUser}>{__("Create new user")}</button></div>
            </>}
            {/* TODO: User list */}
            {user && <Tabs titles={[__("Loans"), __("Holds"), __("edit-button"), __("Remove user")]}>
                <Tab>
                    <div>
                        <button onClick={clearUser}>{__("clear-button")}</button>
                        <div>{__("Name")}: {user.name}</div>
                        <div>{__("Barcode")}: {user.barcode}</div>
                        <div>{__("Loans")}: {user.loans.length}</div>
                        <div>{__("Holds")}: {user.holds.length}</div>
                        <div>{user.loans.map(loan => <Loan key={loan.id} loan={loan} staff={true} />)}</div>
                    </div>
                </Tab>
                <Tab>
                    <div>{user.holds.map(hold => <React.Fragment key={hold._id}>
                        <div>
                            <Link to={`/staff/record/${hold.record.id}`}>{hold.record.title}</Link>
                            <div>{__("Pick-up location")}: {hold.location.name}</div>
                        </div>
                        <hr />
                    </React.Fragment>)}</div>
                </Tab>
                <Tab>
                    <Form onSubmit={handleUpdateUser}>
                        <Input name="name" title={__("Name")} value={user.name} />
                        <Input name="username" title={__("Username")} value={user.username} />
                        <Input name="barcode" title={__("Barcode")} value={user.barcode} />
                        <Input name="password" title={__("Password")} type="password" />
                        <Button title={__("save-button")} />

                        {/* TODO: 
                        address: <input username="address" />
                        email: <input username="email" />
                        phone: <input username="phone" />*/}
                    </Form>
                </Tab>
                <Tab>
                    <p>{__("User must not have active loans or holds.")}</p>
                    <div><input type="checkbox" checked={imsure} onChange={e => setImsure(e.target.checked)} /> {__("I am sure")}</div>
                    <button className="remove-user-button" disabled={!imsure} onClick={handleRemoveUser}>{__("Remove user")}</button>
                </Tab>
            </Tabs>}
        </>
    );
};

export default connect(
    state => ({
        user: state.circulation.user,
        __: __(state)
    }),
    { searchForUser, clearUser, createUser, updateUser, removeUser }
)(StaffUser);