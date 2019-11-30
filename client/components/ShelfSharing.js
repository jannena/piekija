import React, { useState } from "react";
import shelfService from "../services/shelfService";
import { connect } from "react-redux";
import { shareShelf, unshareShelf } from "../reducers/shelfReducer";
import { useField } from "../hooks";
import __ from "../langs";

const ShelfSharing = ({ shelf, isAuthor, shareShelf, unshareShelf, __ }) => {
    const { reset: resetShareWith, ...shareWith } = useField("text");

    const handleShelfSharing = e => {
        e.preventDefault();
        shareShelf(shareWith.value);
        resetShareWith();
    };

    const handleShelfUnsharing = username => () => {
        unshareShelf(username);
    };

    return (<>
        <h3>{__("Shared with")}</h3>
        <ul>
            {shelf.sharedWith.map(user => <li key={user.id}>
                {user.name} ({user.username})
                {isAuthor && <button onClick={handleShelfUnsharing(user.username)}>{__("unshare-button")}</button>}
            </li>)}
        </ul>
        {isAuthor && <form onSubmit={handleShelfSharing}>
            <input placeholder={__("Share with...")} {...shareWith} />
            <button>{__("share-button")}</button>
        </form>}
    </>);
};

export default connect(
    state => ({
        __: __(state)
    }),
    { shareShelf, unshareShelf }
)(ShelfSharing);