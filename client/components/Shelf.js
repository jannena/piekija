import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import ShelfRecord from "./ShelfRecord";
import ShelfSharing from "./ShelfSharing";
import { connect } from "react-redux";
import { getShelf, updateShelf } from "../reducers/shelfReducer";

const Shelf = ({ state, shelfId, shelf, token, user, getShelf, updateShelf }) => {

    useEffect(() => {
        if (shelfId !== (shelf || { id: null }).id) getShelf(shelfId);
    }, [shelfId, token]);

    const [isOpen, setIsOpen] = useState();

    if (state.state === 1) return <Loader />;
    if (state.state === 3) return <p>Error: {state.error}</p>;
    if (!shelf) return null;

    const isAuthor = () => shelf.author.id === user.id;
    const canEdit = () => isAuthor() || (shelf.sharedWith || []).some(u => user.id === u.id);

    const saveShelf = e => {
        e.preventDefault();
        updateShelf(e.target.name.value, e.target.description.value, e.target.public.checked);
        setIsOpen(false);
    };

    return (
        <div>
            {isOpen && canEdit()
                ? <>
                    <form onSubmit={saveShelf}>
                        <div><input name="name" defaultValue={shelf.name} /></div>
                        <div><textarea name="description" defaultValue={shelf.description} /></div>
                        <div><input name="public" id="public" type="checkbox" defaultChecked={shelf.public} /> <label htmlFor="public">Public shelf</label></div>
                        <button>Save</button>
                    </form>
                    <button onClick={() => setIsOpen(false)}>Cancel</button>
                </>

                : <>
                    <h2>{shelf.name}</h2>
                    <div>DESCRIPTION: {shelf.description}</div>
                    <div>AUTHOR: {isAuthor() ? "you" : shelf.author.name}</div>

                    {canEdit() && <div><button onClick={() => setIsOpen(true)}>Edit</button></div>}
                </>
            }
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
    { getShelf, updateShelf }
)(Shelf);