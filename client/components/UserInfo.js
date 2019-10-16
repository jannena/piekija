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


const UserInfo = ({ user, createShelf, updateUser, notify }) => {
    if (!user) return <div></div>;

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
        else notify("warning", "passwords does not match");
    };

    return (
        <Tabs titles={["Loans", "Shelves", "Holds", "Edit me", "Two-factor authentication"]}>
            <Tab>
                <h2>{user.name}</h2>
                <div>{user.username}</div>
                <div>{user.barcode}</div>
                <h3>Loans</h3>
                <div>
                    {user.loans.map(loan => <Loan key={loan.id} loan={loan} staff={false} />)}
                </div>
            </Tab>
            <Tab>
                <h3>Shelves</h3>
                <Tabs titles={["my shelves ", " shared with me"]}>
                    <Tab>
                        <form onSubmit={createNewShelf}>
                            <input name="newShelfName" />
                            <button>Create shelf</button>
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
                    <Input name="name" title="Name" value={user.name} />
                    <Input type="password" title="New password" description="Leave empty if you do not want to change it." name="password" />
                    <Input type="password" title="New password again" name="againPassword" />
                    <Input type="password" title="Old password" name="oldPassword" />
                    <Button title="Save " />
                </Form>
            </Tab>

            <Tab>
                <h3> Two-factor authentication</h3>
                <TFAForm />
            </Tab>
        </Tabs>
    );
};

export default connect(
    state => ({
        user: state.user
    }),
    { createShelf, updateUser, notify }
)(UserInfo);