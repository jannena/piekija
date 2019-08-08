import React, { useState, useEffect } from "react";
import shelfService from "../services/shelfService";
import { Link } from "react-router-dom";

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

    return (
        <div>
            <h2>{shelf.name}</h2>
            <div>DESCRIPTION: {shelf.description}</div>
            <div>AUTHOR: {shelf.author.id === user.id ? "you" : shelf.author.name}</div>
            {shelf.sharedWith && <>
                <h3>Shared with</h3>
                <ul>
                    {shelf.sharedWith.map(user => <li key={user.id}>{user.name} ({user.username})</li>)}
                </ul>
            </>}
            <h3>Records:</h3>
            <table>
                <tbody>
                    {shelf.records.map(record =>
                        <tr key={record.record.id}>
                            <td><Link to={`/record/${record.record.id}`}>{record.record.title}</Link></td>
                            <td>{record.note}</td>
                        </tr>)}
                </tbody>
            </table>
        </div>
    );
};

export default Shelf;