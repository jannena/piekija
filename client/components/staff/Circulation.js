import React from "react";
import { connect } from "react-redux";
import { searchForUser, searchForItem, clearUser, clearItem, loanItem, returnItem, history } from "../../reducers/circulationReducer";

const Circulation = ({ user, item, searchForItem, searchForUser, clearUser, clearItem, loanItem, returnItem, history }) => {
    const searchUser = e => {
        e.preventDefault();
        searchForUser(e.target.user.value);
    };

    const searchItem = e => {
        e.preventDefault();
        searchForItem(e.target.item.value);
    };

    return (<>
        <div>
            <div>
                <form onSubmit={searchUser}>
                    <label htmlFor="user">User barcode</label> <input id="user" name="user" />
                    <button>Search</button>
                </form>
                {user && <button onClick={clearUser}>Clear</button>}
            </div>
            {user && <div style={{ paddingLeft: 10 }}>
                <div>Barcode: {user.barcode}</div>
                <div>Name: {user.name} ({user.loans.length} loans)</div>
                <button>Show user</button>
            </div>}
        </div>

        <hr />

        <div>
            <div>
                <form onSubmit={searchItem}>
                    <label htmlFor="item">Item barcode: </label> <input id="item" name="item" />
                    <button>Search</button>
                </form>
                {item && <button onClick={clearItem}>Clear</button>}
            </div>
            {item && <div style={{ paddingLeft: 10 }}>
                <div>Title: {item.record && item.record.title}</div>
                <div>Location: {item.location && item.location.name}</div>
                <div>Loantype: {item.loantype && item.loantype.name}</div>
                <div>State: <strong>{item.state}</strong> {item.state === "loaned" && `for ${item.statePersonInCharge.name}`}</div>
                {/* TODO: If loaned, show return button */}
                {item.state === "loaned" && <button onClick={returnItem}>Return</button>}
                <button onClick={() => history.push(`/staff/record/${item.record.id}`)}>Show record</button>
            </div>}
        </div>

        <hr />

        {(user && item) && <>
            <div>
                {/* TODO: If user has not already loaned this item */}
                {item.state !== "loaned" && <button onClick={loanItem}>Loan item to {user.name}</button>}
                {/* TODO: If user has already loaned this item */}
                {user.loans.some(l => l._id === item.id) && <button>Renew</button>}
            </div>
        </>}
    </>);
};

export default connect(
    state => ({
        user: state.circulation.user,
        item: state.circulation.item
    }),
    { searchForItem, searchForUser, clearItem, clearUser, loanItem, returnItem }
)(Circulation);