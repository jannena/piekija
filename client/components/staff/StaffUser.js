import React from "react";
import { connect } from "react-redux";
import { searchForUser, clearUser, createUser } from "../../reducers/circulationReducer";
import Loan from "./Loan";

const StaffUser = ({ users, clearUser, user, searchForUser, createUser }) => {
    const handleUserSearch = e => {
        e.preventDefault();
        const { barcode, name } = e.target;
        if (!barcode.value && !name.value) return console.log("Barcode and name ar missing");
        const query = barcode.value ? { barcode: barcode.value } : { name: name.value }
        searchForUser(query);
    };
    const handlecreateNewUser = () => {
        createUser();
    };

    return (
        <>
            {!user && <>
                <div>
                    <form onSubmit={handleUserSearch}>
                        <div>Barcode: <input name="barcode" /></div>
                        <div>Name: <input name="name" /></div>
                        <div><button>Search</button></div>
                    </form>
                </div>
                <hr />
                <div><button onClick={handlecreateNewUser}>Create new user</button></div>
            </>}
            {/* TODO: User list */}
            <div>
                {user && <>
                    <button onClick={clearUser}>Clear</button>
                    <div>Name: {user.name}</div>
                    <div>Barcode: {user.barcode}</div>
                    <div>Loans: {user.loans.length}</div>
                    <div>{user.loans.map(loan => <Loan key={loan.id} loan={loan} staff={true} />)}</div>
                </>}
            </div>
        </>
    );
};

export default connect(
    state => ({
        user: state.circulation.user
    }),
    { searchForUser, clearUser, createUser }
)(StaffUser);