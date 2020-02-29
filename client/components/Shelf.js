import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import ShelfRecord from "./ShelfRecord";
import ShelfSharing from "./ShelfSharing";
import { connect } from "react-redux";
import { getShelf, updateShelf, removeShelf, deleteRecordFromShelf } from "../reducers/shelfReducer";
import { Tabs, Tab } from "./Tabs";
import { useField } from "../hooks";
import { withRouter } from "react-router-dom";
import __ from "../langs";
import io from "../socket";
import { Form, Input, Checkbox, Textarea, Button, DoNotSendButton, Grid } from "./essentials/forms";

const Shelf = ({ state, shelfId, shelf, token, user, getShelf, updateShelf, removeShelf, history, __ }) => {
    document.title = `${__("title-Shelf")} - ${__("PieKiJa")}`;

    useEffect(() => {
        if (shelfId && token && user && io) io.emit("change shelf", shelfId, token);
    }, [shelfId, token, user, io]);

    useEffect(() => {
        if (shelfId !== (shelf || { id: null }).id) getShelf(shelfId);
    }, [shelfId, token]);

    const [isOpen, setIsOpen] = useState();

    const checkName = useField("text");

    if (state.state === 1) return <Loader />;
    if (state.state === 3) return <p>{__("Error")}: {state.error}</p>;
    if (!shelf) return null;

    document.title = `${shelf.name} - PieKiJa`

    const isAuthor = () => user && shelf.author.id === user.id;
    const canEdit = () => isAuthor() || (shelf.sharedWith || []).some(u => user.id === u.id);

    const saveShelf = e => {
        e.preventDefault();
        updateShelf(e.target.name.value, e.target.description.value, e.target.public.checked);
        setIsOpen(false);
    };

    const handleRemoveShelf = e => {
        console.log("Joo");
        removeShelf(history);
    };

    const titles = [__("records-shelves"), __("About shelf")];
    if (canEdit()) titles.push(__("Share with"));
    if (isAuthor()) titles.push(__("Remove shelf"));

    return (
        <>
            <div style={{ display: "flex" }}>
                <h2>{shelf.name}</h2>
                <div style={{ margin: 22 }}>{__("Author")}: {isAuthor() ? __("you") : shelf.author.name}</div>
            </div>
            <Tabs titles={titles}>
                <Tab>

                    <h3>{__("records-shelves")}</h3>
                    {/* <table>
                        <tbody> */}
                    {shelf.records.map(record =>
                        <ShelfRecord
                            key={record.record.id}
                            record={record}
                            canEdit={canEdit()}
                        />)}
                    {/*  </tbody>
                    </table> */}
                </Tab>
                <Tab>
                    {isOpen && isAuthor()
                        ? <>
                            <Form onSubmit={saveShelf}>
                                <Input name="name" title={__("Name")} value={shelf.name} />
                                <Textarea name="description" title="description" title={__("Description")} value={deleteRecordFromShelf.description} />
                                <Checkbox name="public" title={__("Public shelf")} />
                                <Grid>
                                    <DoNotSendButton title={__("cancel-button")} onClick={() => setIsOpen(false)} />
                                    <Button title={__("save-button")} />
                                </Grid>
                            </Form>
                        </>

                        : <>
                            <div style={{ margin: 20 }}>{__("Description")}: {shelf.description}</div>

                            {isAuthor() && <div><button onClick={() => setIsOpen(true)}>{__("edit-button")}</button></div>}
                        </>
                    }
                </Tab>
                <Tab>
                    {shelf.sharedWith && <ShelfSharing setShelf={() => { }} token={token} shelf={shelf} isAuthor={isAuthor()} />}
                </Tab>
                <Tab>
                    {isAuthor() ? <div>
                        <div>{__("remove-shelf-confirmation")}</div>
                        <input {...checkName.props} />
                        <div><button onClick={handleRemoveShelf} disabled={checkName.value !== shelf.name}>{__("remove-button")}</button></div>
                    </div> : <div>{__("remove-shelf-not-possible")}</div>}
                </Tab>
            </Tabs>
        </>
    );
};

export default connect(
    state => ({
        token: state.token.token,
        user: state.user,
        shelf: state.shelf.shelf,
        state: state.loading.shelf,
        __: __(state)
    }),
    { getShelf, updateShelf, removeShelf }
)(withRouter(Shelf));