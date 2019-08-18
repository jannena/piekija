import React from "react";
import { Link } from "react-router-dom";
import UpdateUserForm from "./UpdateUserForm";
import TFAForm from "./TFAForm";
import { Tabs, Tab } from "./Tabs";
import { connect } from "react-redux";
import { createShelf } from "../reducers/shelfReducer";


const UserInfo = ({ user, createShelf }) => {
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

            <h3>Change your information</h3>
            <UpdateUserForm />

            <h3>Two-factor authentication</h3>
            <TFAForm />
        </div>
    );
};

export default connect(
    state => ({
        user: state.user
    }),
    { createShelf }
)(UserInfo);