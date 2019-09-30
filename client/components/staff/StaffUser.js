import React from "react";
import { connect } from "react-redux";
import { searchForUser } from "../../reducers/circulationReducer";

const StaffUser = ({ users, user, searchForUser }) => {
    const handleUserSearch = e => {
        e.preventDefault();
        const { barcode, name } = e.target;
        if (!barcode.value && !name.value) return console.log("Barcode and name ar missing");
        const query = barcode.value ? { barcode: barcode.value } : { name: name.value }
        searchForUser(query);
    };
    // TODO: Creation of a new user

    return (
        <>
            <div>
                <form onSubmit={handleUserSearch}>
                    <div>Barcode: <input name="barcode" /></div>
                    <div>Name: <input name="name" /></div>
                    <div><button>Search</button></div>
                </form>
            </div>
            {/* TODO: User list */}
            <div>
                {user && <>
                    <div>Name: {user.name}</div>
                    <div>Barcode: {user.barcode}</div>
                    <div>Loans: {user.loans.map(loan => <div>
                        <hr />
                        <div>{loan.item.record.title} ({loan.item.barcode})</div>
                        <div>Due date: {loan.item.stateDueDate}</div>
                        <div>Location: {loan.item.location.name}</div>
                    </div>)}</div>
                </>}
            </div>
        </>
    );
};

export default connect(
    state => ({
        user: state.circulation.user
    }),
    { searchForUser }
)(StaffUser);