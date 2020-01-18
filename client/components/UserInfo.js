import React from "react";
import { Link } from "react-router-dom";
import TFAForm from "./TFAForm";
import { Tabs, Tab } from "./Tabs";
import { connect } from "react-redux";
import { createShelf } from "../reducers/shelfReducer";
import { updateUser } from "../reducers/userReducer";
import { notify } from "../reducers/notificationReducer";
import Loan from "./staff/Loan";
import { Form, Input, Button } from "./essentials/forms";
import __ from "../langs";


const UserInfo = ({ user, createShelf, updateUser, notify, __ }) => {
    if (!user) return <div></div>;

    document.title = `${__("title-User")} - ${__("PieKiJa")}`;

    const printShelves = shelves => {
        const mapped = shelves.map(shelf => shelf.id ? <li key={shelf.id.id}><Link to={`/shelf/${shelf.id.id}`}>{shelf.id.name}</Link></li> : null);
        console.log(mapped, mapped.filter(shelf => shelf).length);
        if (mapped.filter(shelf => shelf).length === 0) return <p>No shelves</p>;
        return mapped
    };

    const createNewShelf = e => {
        e.preventDefault();
        createShelf(e.target.newShelfName.value, false);
    };

    const handleUpdateMe = e => {
        const { name, password, againPassword, oldPassword } = e.target;
        if (password.value === againPassword.value) updateUser(oldPassword.value, name.value, password.value);
        else notify("warning", "Passwords do not match");
    };

    return (
        <Tabs titles={[__("Loans"), __("Shelves"), __("Holds"), __("Edit me"), __("Two-factor authentication")]}>
            <Tab>
                <h2>{user.name}</h2>
                <div>{user.username}</div>
                <div>{user.barcode}</div>
                <h3>{__("Loans")}</h3>
                <div>
                    {user.loans.map(loan => <Loan key={loan.id} loan={loan} staff={false} />)}
                </div>
            </Tab>
            <Tab>
                <h3>{__("Shelves")}</h3>
                <Tabs titles={[__("My shelves"), __("Shared with me")]}>
                    <Tab>
                        <form onSubmit={createNewShelf}>
                            <input name="newShelfName" />
                            <button>{__("Create shelf")}</button>
                        </form>
                        <ul>
                            {printShelves(user.shelves.filter(shelf => shelf.author))}
                        </ul>
                    </Tab>
                    <Tab>
                        <ul>
                            {printShelves(user.shelves.filter(shelf => !shelf.author))}
                        </ul>
                    </Tab>
                </Tabs>
            </Tab>

            <Tab>
                <p>Coming soon!</p>
            </Tab>

            <Tab>
                <Form onSubmit={handleUpdateMe}>
                    <Input name="name" title={__("Name")} value={user.name} />
                    <Input type="password" title={__("New password")} description={__("new-password-info")} name="password" />
                    <Input type="password" title={__("New password again")} name="againPassword" />
                    <Input type="password" title={__("Old password")} name="oldPassword" />
                    <Button title={__("save-button")} />
                </Form>
            </Tab>

            <Tab>
                <h3>{__("Two-factor authentication")}</h3>
                <TFAForm />
            </Tab>
        </Tabs>
    );
};

export default connect(
    state => ({
        user: state.user,
        __: __(state)
    }),
    { createShelf, updateUser, notify }
)(UserInfo);