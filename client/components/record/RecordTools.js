import React, { useState } from "react";
import Select from "../Select";
import { connect } from "react-redux";
import { addRecordToShelf } from "../../reducers/shelfReducer";

const RecordTools = ({ record, user, addRecordToShelf }) => {

    if (!user) return null;

    const handleAddToShelf = e => {
        e.preventDefault();
        console.log(record);
        addRecordToShelf(e.target.shelf.value, record.result.id);
    };

    return (
        <div>
            <form onSubmit={handleAddToShelf}>
                <Select name="shelf" options={user.shelves.map(shelf => [shelf.id.name, shelf.id.id])} />
                <button>Add to shelf</button>
            </form>
            {user.staff === true && <button>Edit record</button>}
        </div>
    );
};

export default connect(
    state => ({
        user: state.user
    }),
    { addRecordToShelf }
)(RecordTools);