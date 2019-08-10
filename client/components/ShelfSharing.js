import React, { useState } from "react";
import shelfService from "../services/shelfService";

const ShelfSharing = ({ shelf, setShelf, token, isAuthor }) => {
    const [shareWith, setShareWith] = useState("");

    const handleShelfSharing = e => {
        e.preventDefault();
        shelfService
            .share(shelf.id, shareWith, token)
            .then(result => {
                console.log(result);
                setShareWith("");
                setShelf({
                    ...shelf,
                    sharedWith: [ ...shelf.sharedWith, result ]
                });
            })
            .catch(err => {
                console.log(err, err.response.data.error);
            });
    };

    const handleShelfUnsharing = username => () => {
        shelfService
            .unshare(shelf.id, username, token)
            .then(result => {
                console.log(result);
                setShelf({
                    ...shelf,
                    sharedWith: shelf.sharedWith.filter(u => u.username !== username)
                });
            })
            .catch(err => {
                console.log(err, err.response.data.error);
            });
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
            <input placeholder="Share with..." value={shareWith} onChange={e => setShareWith(e.target.value)} />
            <button>Share</button>
        </form>}
    </>);
};

export default ShelfSharing;