import React, { useState, useEffect } from "react";
import shelfService from "../services/shelfService";
import { Link } from "react-router-dom";
import ShelfRecord from "./ShelfRecord";
import ShelfSharing from "./ShelfSharing";

const Shelf = ({ shelfId, token, user }) => {
    const [shelf, setShelf] = useState(null);

    useEffect(() => {
        shelfService
            .get(shelfId, token)
            .then(res => {
                console.log(res);
                setShelf(res);
            })
            .catch(err => {
                console.log(err);
            });
    }, [shelfId, token]);

    if (!shelf || !user) return null;

    const isAuthor = () => shelf.author.id === user.id;

    const canEdit = () => isAuthor() || (shelf.sharedWith || []).some(u => user.id);

    return (
        <div>
            <h2>{shelf.name}</h2>
            <div>DESCRIPTION: {shelf.description}</div>
            <div>AUTHOR: {isAuthor() ? "you" : shelf.author.name}</div>
            {shelf.sharedWith && <ShelfSharing setShelf={setShelf} token={token} shelf={shelf} isAuthor={isAuthor()} />}
            <h3>Records:</h3>
            <table>
                <tbody>
                    {shelf.records.map(record =>
                        <ShelfRecord
                            key={record.record.id}
                            record={record}
                            canEdit={canEdit()}
                            token={token}
                            shelfId={shelf.id} />)}
                </tbody>
            </table>
        </div>
    );
};

export default Shelf;