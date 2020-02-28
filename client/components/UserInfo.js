import React from "react";
import { Link } from "react-router-dom";
import TFAForm from "./TFAForm";
import { Tabs, Tab } from "./Tabs";
import { connect } from "react-redux";
import { createShelf } from "../reducers/shelfReducer";
import { updateUser, disconnectGoogleAccount } from "../reducers/userReducer";
import { notify } from "../reducers/notificationReducer";
import { removeAHold } from "../reducers/circulationReducer";
import Loan from "./staff/Loan";
import LoanHistory from "./user/LoanHistory";
import { Form, Input, Button, Text, Grid, DoNotSendButton } from "./essentials/forms";
import __ from "../langs";
import { baseUrl } from "../globals";
import Review from "./Review";
import { Table, TableRow, TableCell } from "./essentials/Tables";
import { removeReview } from "../reducers/recordReducer";


const UserInfo = ({ user, createShelf, updateUser, notify, removeAHold, disconnectGoogleAccount, removeReview, __ }) => {
    if (!user) return <div>{__("You logged out succefully")}. <Link to="">{__("Back to frontpage")}</Link>.</div>;

    document.title = `${__("title-User")} - ${__("PieKiJa")}`;

    const printShelves = shelves => {
        const mapped = shelves.map(shelf => shelf.id ? <li key={shelf.id.id}><Link to={`/shelf/${shelf.id.id}`}>{shelf.id.name}</Link></li> : null);
        console.log(mapped, mapped.filter(shelf => shelf).length);
        if (mapped.filter(shelf => shelf).length === 0) return <p>{__("No shelves")}</p>;
        return mapped
    };

    const createNewShelf = e => {
        e.preventDefault();
        createShelf(e.target.newShelfName.value, false);
    };

    const handleUpdateMe = e => {
        const { name, password, againPassword, oldPassword } = e.target;
        if (password.value === againPassword.value) updateUser(oldPassword.value, name.value, password.value);
        else notify("warning", "Passwords do not match");
    };

    const handleRemoveAHold = id => () => {
        removeAHold(id);
    };

    const googleAccount = user.connectedAccounts.filter(({ account }) => account === "google")[0];
    const piekijaAccounts = user.connectedAccounts.filter(({ account }) => account === "piekija");

    return (
        <Tabs titles={[__("Loans"), __("Loan history"), __("Shelves"), __("Holds"), __("Edit me"), __("Connected accounts"), __("Reviews")]}>
            <Tab>
                <h2>{user.name}</h2>
                <div>{user.username}</div>
                <div>{user.barcode}</div>
                <h3>{__("Loans")}</h3>
                <div>
                    {user.loans.map(loan => <Loan key={loan.id} loan={loan} staff={false} />)}
                </div>
            </Tab>
            <Tab>
                <LoanHistory />
            </Tab>
            <Tab>
                <h3>{__("Shelves")}</h3>
                <Tabs titles={[__("My shelves"), __("Shared with me")]}>
                    <Tab>
                        <form onSubmit={createNewShelf}>
                            <input name="newShelfName" />
                            <button>{__("Create shelf")}</button>
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
                {user.holds.map(loan =>
                    <div>
                        <hr />
                        <div><Link to={`/record/${loan.record.id}`}>{loan.record.title}</Link></div>
                        {loan.queue !== 0 && <div>{__("Queue number")}: {loan.queue}</div>}
                        {loan.queue === 0 && <div>{__("State")}: {__(loan.state)}</div>}
                        <div>{__("Pick-up location")}: {loan.location && loan.location.name}</div>
                        {loan.queue !== 0 && <div><button onClick={handleRemoveAHold(loan.record.id)}>{__("Remove hold")}</button></div>}
                    </div>)}
            </Tab>

            <Tab>
                <h2>{__("Edit me")}</h2>
                <Form onSubmit={handleUpdateMe}>
                    <Input name="name" title={__("Name")} value={user.name} />
                    <Input type="password" title={__("New password")} description={__("new-password-info")} name="password" />
                    <Input type="password" title={__("New password again")} name="againPassword" />
                    <Input type="password" title={__("Old password")} name="oldPassword" />
                    <Button title={__("save-button")} />
                </Form>
                <h2>{__("Two-factor authentication")}</h2>
                <TFAForm />
            </Tab>

            <Tab>
                <h3>Google</h3>
                {googleAccount
                    ? <>
                        {googleAccount.data.image && <img width={50} src={googleAccount.data.image} />}
                        <span>{googleAccount.accountId}</span>
                        <button onClick={disconnectGoogleAccount}>{__("disconnect-button")}</button>
                    </>
                    : <button onClick={() => {
                        document.cookie = `piekija-token=${window.localStorage.getItem("piekija-token")}`;
                        location.href = `${baseUrl}/google/login`;
                    }}>{__("connect-button")}</button>}
                <h3>{__("Other Piekija accounts")}</h3>
                {piekijaAccounts.length === 0 && <div>{__("piekija-account-info")}</div>}
                {piekijaAccounts.map(a => <div>{a.id} <button>{__("switch-button")}</button></div>)}
            </Tab>

            <Tab>
                {/* {user.reviews.map(r => <Review key={r.id} review={r} record={true} forceRemoveReview={true} />)} */}
                <Table titles={[__("Title")]} widths={[100]} data={user.reviews} form={data => <div>
                    <Form>
                        <Text title={__("Reviewed on")} value={__("date-format")(new Date(data.timeAdded || 0))} />
                        <Text title={__("Review")} value={data.review} />
                        <Text title={__("Score")} value={data.score} />
                        <Text title={__("Is public review?")} value={String(data.public)} />
                        <DoNotSendButton title={__("remove-button")} onClick={() => {
                            removeReview(data.record.id, data.id);
                        }} />
                    </Form>
                </div>}>
                    {user.reviews.map(r => <TableRow key={r.id}>
                        <TableCell>{r.record.title}</TableCell>
                    </TableRow>)}
                </Table>
            </Tab>
        </Tabs>
    );
};

export default connect(
    state => ({
        user: state.user,
        __: __(state)
    }),
    { createShelf, updateUser, notify, removeAHold, disconnectGoogleAccount, removeReview }
)(UserInfo);