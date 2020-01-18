import React from "react";
import { connect } from "react-redux";
import { searchForUser, searchForItem, clearUser, clearItem, loanItem, returnItem } from "../../reducers/circulationReducer";
import __ from "../../langs";

const Circulation = ({ user, item, searchForItem, searchForUser, clearUser, clearItem, loanItem, returnItem, history, __ }) => {
    const searchUser = e => {
        e.preventDefault();
        searchForUser({ barcode: e.target.user.value });
    };

    const searchItem = e => {
        e.preventDefault();
        searchForItem(e.target.item.value);
    };

    return (<>
        <div>
            <div style={{ display: "flex" }}>
                <form onSubmit={searchUser}>
                    <label htmlFor="user">{__("User barcode")}</label> <input id="user" name="user" />
                    <button>{__("search-button")}</button>
                </form>
                {user && <button onClick={clearUser}>{__("clear-button")}</button>}
            </div>
            {user && <div style={{ paddingLeft: 10 }}>
                <div>{__("Barcode")}: {user.barcode}</div>
                <div>{__("Name")}: {user.name} ({user.loans.length} {__("after-number-loans")})</div>
                <button onClick={() => history.push("/staff/users")}>{__("Show user")}</button>
            </div>}
        </div>

        <hr />

        <div>
            <div style={{ display: "flex" }}>
                <form onSubmit={searchItem}>
                    <label htmlFor="item">{__("Item barcode")}: </label> <input id="item" name="item" />
                    <button>{__("search-button")}</button>
                </form>
                {item && <button onClick={clearItem}>{__("clear-button")}</button>}
            </div>
            {item && <div style={{ paddingLeft: 10 }}>
                <div>{__("Title")}: {item.record && item.record.title}</div>
                <div>{__("Location")}: {item.location && item.location.name} ({item.shelfLocation})</div>
                <div>{__("Loantype")}: {item.loantype && item.loantype.name}</div>
                <div>{__("State")}: <strong>{__(item.state)}</strong> {item.state === "loaned" && `${__("circulation-for")} ${item.statePersonInCharge && item.statePersonInCharge.name} (${item.statePersonInCharge.barcode})`}</div>
                {item.note && <div>{__("Note")}: <strong>{item.note}</strong></div>}
                {item.state === "loaned" && <button onClick={returnItem}>{__("return-button")}</button>}
                <button onClick={() => history.push(`/staff/record/${item.record.id}`)}>{__("Show record")}</button>
            </div>}
        </div>

        <hr />

        {(user && item) && <>
            <div>
                {/* If user has not already loaned this item */}
                {item.state !== "loaned" && <button onClick={loanItem}>{__("Loan item to")} {user.name}</button>}
                {/* If user has already loaned this item */}
                {user.loans.some(l => l._id === item.id) && <button>{__("renew-button")}</button>}
            </div>
        </>}
    </>);
};

export default connect(
    state => ({
        user: state.circulation.user,
        item: state.circulation.item,
        __: __(state)
    }),
    { searchForItem, searchForUser, clearItem, clearUser, loanItem, returnItem }
)(Circulation);