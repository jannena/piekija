import React, { useState } from "react";
import shelfService from "../services/shelfService";
import { connect } from "react-redux";
import { shareShelf, unshareShelf } from "../reducers/shelfReducer";
import { useField } from "../hooks";

const ShelfSharing = ({ shelf, isAuthor, shareShelf, unshareShelf }) => {
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
        <h3>Shared with</h3>
        <ul>
            {shelf.sharedWith.map(user => <li key={user.id}>
                {user.name} ({user.username})
                {isAuthor && <button onClick={handleShelfUnsharing(user.username)}>Unshare</button>}
            </li>)}
        </ul>
        {isAuthor && <form onSubmit={handleShelfSharing}>
            <input placeholder="Share with..." {...shareWith} />
            <button>Share</button>
        </form>}
    </>);
};

export default connect(
    null,
    { shareShelf, unshareShelf }
)(ShelfSharing);