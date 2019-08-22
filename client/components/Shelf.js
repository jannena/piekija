import React, { useEffect } from "react";
import ShelfRecord from "./ShelfRecord";
import ShelfSharing from "./ShelfSharing";
import { connect } from "react-redux";
import { getShelf } from "../reducers/shelfReducer";

const Shelf = ({ state, shelfId, shelf, token, user, getShelf }) => {

    useEffect(() => {
        if (shelfId !== (shelf || { id: null }).id) getShelf(shelfId);
    }, [shelfId, token]);

    if (state.state === 1) return <p>Loading...</p>;
    if (state.state === 3) return <p>Error: {state.error}</p>
    if (!shelf) return null;

    const isAuthor = () => shelf.author.id === user.id;
    const canEdit = () => isAuthor() || (shelf.sharedWith || []).some(u => user.id);

    return (
        <div>
            <h2>{shelf.name}</h2>
            <div>DESCRIPTION: {shelf.description}</div>
            <div>AUTHOR: {isAuthor() ? "you" : shelf.author.name}</div>
            {shelf.sharedWith && <ShelfSharing setShelf={() => { }} token={token} shelf={shelf} isAuthor={isAuthor()} />}
            <h3>Records:</h3>
            <table>
                <tbody>
                    {shelf.records.map(record =>
                        <ShelfRecord
                            key={record.record.id}
                            record={record}
                            canEdit={canEdit()}
                        />)}
                </tbody>
            </table>
        </div>
    );
};

export default connect(
    state => ({
        token: state.token.token,
        user: state.user,
        shelf: state.shelf.shelf,
        state: state.loading.shelf
    }),
    { getShelf }
)(Shelf);